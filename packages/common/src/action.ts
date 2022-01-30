import { IMediaClip, IVideoState } from ".";
import { IMediaSnapshot } from "./media";

export enum ActionType {
    CONTENT_PLAY_RECORDING,
    CONTENT_VIDEO_DATA,

    BACKGROUND_SAVE_SNAPSHOT,
    BACKGROUND_PLAY_RECORDING,
    BACKGROUND_CONTENT_VIDEO_DATA,
    BACKGROUND_POPUP_VIDEO_DATA,

    POPUP_VIDEO_DATA
}

interface IContentReplayRecording {
    action: ActionType.CONTENT_PLAY_RECORDING
    payload: {
        clip: IMediaClip
    }
}

interface IContentVideoData {
    action: ActionType.CONTENT_VIDEO_DATA
}

export type IContentAction = IContentReplayRecording | IContentVideoData;

interface IBackgroundReplayRecording {
    action: ActionType.BACKGROUND_PLAY_RECORDING,
    payload: {
        clipId: number
    }
}

export interface IBackgroundSaveSnapshot {
    action: ActionType.BACKGROUND_SAVE_SNAPSHOT
    payload: {
        snapshot: IMediaSnapshot
    }
}

export interface IBackgroundContentVideoData {
    action: ActionType.BACKGROUND_CONTENT_VIDEO_DATA
    payload: {
        video: IVideoState
    }
}

export interface IBackgroundPopupVideoData {
    action: ActionType.BACKGROUND_POPUP_VIDEO_DATA
}

export type IBackgroundAction = IBackgroundReplayRecording
    | IBackgroundContentVideoData
    | IBackgroundSaveSnapshot
    | IBackgroundPopupVideoData
    ;

export interface IPopupVideoData {
    action: ActionType.POPUP_VIDEO_DATA
    payload: {
        video?: IVideoState
    }
}

export type IPopupAction = IPopupVideoData;
