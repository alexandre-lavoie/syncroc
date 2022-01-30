import { ActionType, IBackgroundAction, IBackgroundContentVideoData, IContentAction, IContentToggleClip, IMediaClip, IMediaSnapshot, IPopupAction, IPopupVideoData, IVideoState, MediaAction } from "@syncroc/common";

function queryCurrentTab(): Promise<chrome.tabs.Tab> {
    return new Promise<chrome.tabs.Tab>((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) reject(Error("No current active tab."));
            resolve(tabs[0]);
        });
    });
}

function sendMessageToTab<T, K extends IBackgroundAction>(tab: chrome.tabs.Tab, message: T): Promise<K> {
    return new Promise<K>((resolve, reject) => {
        if (tab.id === undefined) reject(Error("Could not get tab id."));
        chrome.tabs.sendMessage(tab.id as unknown as number, message, (response: K) => {
            resolve(response);
        });
    });
}

async function playClipInWindow(clip: IMediaClip): Promise<void> {
    if (clip.length == 0) return;
    let tab = await queryCurrentTab();
    if (tab == undefined) return;

    let tabWidth = tab.width || 800;
    let tabHeight = tab.height || 600;

    let width = Math.floor(tabWidth / 3);
    let height = Math.floor(tabHeight / 3);

    return new Promise((resolve, reject) => {
        chrome.windows.create({
            url: `https://www.youtube.com/embed/${clip[0].media.id}?autoplay=1`,
            type: "popup",
            width,
            height
        }, (window?: chrome.windows.Window) => {
            if (window == undefined) return;
            let tab = window?.tabs?.[0];
            if (tab == undefined) return;
    
            setTimeout(() => {
                if (tab?.id == undefined) return;
    
                let message: IContentToggleClip = {
                    action: ActionType.CONTENT_TOGGLE_CLIP,
                    payload: {
                        clip
                    }
                };
    
                chrome.tabs.sendMessage(tab.id, message);

                resolve();
            }, 3000);
        });
    });
}

export async function main() {
    async function sendMessageToCurrentTab(message: IContentAction, hasResponse: boolean = false) {
        let tab = await queryCurrentTab();
        if (tab.id === undefined) return;

        chrome.tabs.sendMessage(tab.id, message, hasResponse ? async (message: IBackgroundAction) => await handleMessage(message) : undefined);
    }

    async function handleMessage(message: IBackgroundAction, sender?: chrome.runtime.MessageSender, response?: (message: IContentAction | IPopupAction) => void) {
        if (message == undefined || message.action == undefined) return;

        switch (message.action) {
            case ActionType.BACKGROUND_SAVE_SNAPSHOT:
                chrome.storage.local.get(["currentClip"], ({ currentClip }) => {
                    if (currentClip == undefined) {
                        currentClip = [];
                    }
                    chrome.storage.local.set({ currentClip: [...currentClip, message.payload.snapshot] });
                });
                break;
            case ActionType.BACKGROUND_TOGGLE_CLIP:
                chrome.storage.local.get(["clips"], async ({ clips }) => {
                    if (clips === undefined) {
                        clips = [];
                    }

                    if (message.payload.clipId >= clips.length) return;
                    let clip = clips[message.payload.clipId];

                    playClipInWindow(clip);
                    // sendMessageToCurrentTab({ action: ActionType.CONTENT_TOGGLE_CLIP, payload: { clip } });
                });
                break;
            case ActionType.BACKGROUND_AUTOPLAY_CLIP:
                playClipInWindow(message.payload.clip);
                break;
            case ActionType.BACKGROUND_POPUP_VIDEO_DATA:
                if (response == undefined) break;

                let tab = await queryCurrentTab();
                if (tab == undefined) break;

                let video: IVideoState | undefined = undefined;
                if (tab.url !== undefined && tab.url.match(/^https?\:\/\/www\.youtube\.com\/watch/)) {
                    let videoPayload: IBackgroundContentVideoData = await sendMessageToTab(tab, { action: ActionType.CONTENT_VIDEO_DATA });
                    video = videoPayload.payload.video;
                }

                let payloadMessage: IPopupVideoData = {
                    action: ActionType.POPUP_VIDEO_DATA,
                    payload: {
                        video
                    }
                };

                response(payloadMessage);

                break;
        }
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        if (changes?.currentClip?.newValue !== undefined) {
            let currentClip: IMediaClip = changes.currentClip.newValue;

            if (currentClip.length > 0 && currentClip[currentClip.length - 1].action === MediaAction.STOP) {
                chrome.storage.local.get(["currentClip", "clips"], ({ currentClip, clips }) => {
                    if (clips === undefined) clips = [];
                    chrome.storage.local.set({ currentClip: [], clips: [...clips, currentClip] });
                });
            }
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleMessage(request, sender, sendResponse);
        return true;
    });
}
