import { BackgroundActionType, ContentActionType, IBackgroundAction, IContentAction, IMediaClip, IMediaSnapshot, MediaAction, normalizeMediaClip } from "@syncroc/common";
import { BaseMedia, YouTubeVideo } from "./media";

export async function main() {
    let media: BaseMedia = new YouTubeVideo(document.body);
    let replaying: boolean = false;
    let clip: IMediaClip = [];

    function recordTimestamp(action: MediaAction) {
        clip.push({
            time: Date.now(),
            action: action,
            media: media.toObject()
        });
    }

    async function handleMessage(message: IContentAction, sender: chrome.runtime.MessageSender, response: (action: IBackgroundAction) => void) {
        switch(message.action) {
            case ContentActionType.START_RECORDING:
                media.registerDirty(recordTimestamp);
                break;
            case ContentActionType.STOP_RECORDING:
                recordTimestamp(MediaAction.STOP);
                media.removeDirty(recordTimestamp);
                response({
                    action: BackgroundActionType.SAVE_RECORDING,
                    payload: {
                        clip: normalizeMediaClip(clip)
                    }
                });
                clip = [];
                break;
            case ContentActionType.REPLAY_RECORDING:
                if (replaying) break;
                replaying = true;
                await media.playClip(message.payload.clip);
                replaying = false;
                break;
            case ContentActionType.GET_VIDEO_INFO:
                response({
                    action: BackgroundActionType.GET_VIDEO_INFO,
                    payload: {
                        video: media.getVideo()
                    }
                })
                break;
        }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    console.log("🐊 Syncroc Active 🐊");
}
