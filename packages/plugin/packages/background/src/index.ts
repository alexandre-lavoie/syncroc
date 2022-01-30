import { BackgroundActionType, ContentActionType, IBackgroundAction, IBackgroundSaveRecording, IContentAction, IExtensionState, IMediaClip, IMediaSnapshot, IPopupAction, IVideoState, PopupActionType } from "@syncroc/common";

function queryCurrentTab(): Promise<chrome.tabs.Tab> {
    return new Promise<chrome.tabs.Tab>((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) reject(Error("No current active tab."));
            resolve(tabs[0]);
        });
    });
}

export async function main() {
    let state: IExtensionState = {
        recording: false
    };
    let clip: IMediaClip = [];

    async function sendMessageToCurrentTab(message: IContentAction, hasResponse: boolean = false) {
        let tab = await queryCurrentTab();
        if (tab.id === undefined) return;
    
        chrome.tabs.sendMessage(tab.id, message, hasResponse ? async (message: IBackgroundAction) => await handleMessage(message) : undefined);
    }

    async function handleMessage(message: IBackgroundAction, sender?: chrome.runtime.MessageSender, response?: (message: IContentAction | IPopupAction) => void) {
        if (message == undefined || message.action == undefined) return;

        switch (message.action) {
            case BackgroundActionType.START_RECORDING:
                state.recording = true;
                await sendMessageToCurrentTab({ action: ContentActionType.START_RECORDING });
                break;
            case BackgroundActionType.STOP_RECORDING:
                state.recording = false;
                await sendMessageToCurrentTab({ action: ContentActionType.STOP_RECORDING }, true);
                break;
            case BackgroundActionType.SAVE_RECORDING:
                clip = message.payload.clip;
                break;
            case BackgroundActionType.REPLAY_RECORDING:
                await sendMessageToCurrentTab({ action: ContentActionType.REPLAY_RECORDING, payload: { clip } });
                break;
            case BackgroundActionType.GET_STATE:
                if (response === undefined) break;

                let tab = await queryCurrentTab();

                let video: IVideoState | undefined = undefined;
                if (tab.url !== undefined && tab.url.match(/^https?\:\/\/www\.youtube\.com\/watch/)) {
                    video = {
                        title: "Lorem Ipsum",
                        logo: "https://yt3.ggpht.com/ytc/AKedOLRUCSLlZ-vd-b9Y7AId1PcD7Xhf1DB78tdSgRD4OA=s128-c-k-c0x00ffffff-no-rj",
                        chanel: "Lorem Ipsum"
                    };
                }

                response({
                    action: PopupActionType.GET_STATE, payload: {
                        state: {
                            extension: state,
                            video
                        },
                    }
                });

                break;
        }
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { 
        handleMessage(request, sender, sendResponse);
        return true;
    });
}
