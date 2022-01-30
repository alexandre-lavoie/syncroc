import { ActionType, IBackgroundAction, IContentAction, MediaAction } from "@syncroc/common";
import { BaseMedia, YouTubeVideo } from "./media";

export async function main() {
    let media: BaseMedia = new YouTubeVideo(document.body);
    let playing: boolean = false;

    function recordTimestamp(action: MediaAction) {
        let snapshot = {
            time: Date.now(),
            action: action,
            media: media.toObject()
        };

        chrome.runtime.sendMessage({
            action: ActionType.BACKGROUND_SAVE_SNAPSHOT,
            payload: {
                snapshot
            }
        });
    }

    chrome.storage.local.get(["recording"], ({ recording }) => {
        if (recording === true) {
            recordTimestamp(MediaAction.START);
            media.registerDirty(recordTimestamp);
        }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        console.log(changes, area);

        if (changes?.recording?.newValue !== undefined) {
            let recording: boolean = changes.recording.newValue;

            if (recording) {
                recordTimestamp(MediaAction.START);
                media.registerDirty(recordTimestamp);
            } else {
                recordTimestamp(MediaAction.STOP);
                media.removeDirty(recordTimestamp);
            }
        }

        if (changes?.playing?.newValue !== undefined) {
            let playing: boolean = changes.playing.newValue;

            if (!playing) {
                media.stopClip();
            }
        }
    });

    async function handleMessage(message: IContentAction, sender: chrome.runtime.MessageSender, response: (action: IBackgroundAction) => void) {
        switch (message.action) {
            case ActionType.CONTENT_TOGGLE_CLIP:
                if (playing) {
                    media.stopClip();
                    media.setPlaying(false);
                    break;
                }
                playing = true;
                chrome.storage.local.set({ playing: true });
                await media.playClip(message.payload.clip);
                playing = false;
                chrome.storage.local.set({ playing: false });
                break;
            case ActionType.CONTENT_VIDEO_DATA:
                response({
                    action: ActionType.BACKGROUND_CONTENT_VIDEO_DATA,
                    payload: {
                        video: media.getVideo()
                    }
                });
                break;
        }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    console.log("🐊 Syncroc Active 🐊");
}
