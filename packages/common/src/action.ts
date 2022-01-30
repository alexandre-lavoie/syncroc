import { IMediaClip, IVideoState } from ".";
import { IMediaSnapshot } from "./media";

export enum ActionType {
    CONTENT_TOGGLE_CLIP,
    CONTENT_VIDEO_DATA,

    BACKGROUND_SAVE_SNAPSHOT,
    BACKGROUND_TOGGLE_CLIP,
    BACKGROUND_CONTENT_VIDEO_DATA,
    BACKGROUND_POPUP_VIDEO_DATA,
    BACKGROUND_AUTOPLAY_CLIP,

    POPUP_VIDEO_DATA
}

export interface IContentToggleClip {
    action: ActionType.CONTENT_TOGGLE_CLIP
    payload: {
        clip: IMediaClip
    }
}

export interface IContentVideoData {
    action: ActionType.CONTENT_VIDEO_DATA
}

export type IContentAction = IContentToggleClip | IContentVideoData;

export interface IBackgroundToggleClip {
    action: ActionType.BACKGROUND_TOGGLE_CLIP,
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

export interface IBackgroundAutoplayClip {
    action: ActionType.BACKGROUND_AUTOPLAY_CLIP,
    payload: {
        clip: IMediaClip
    }
}

export type IBackgroundAction = IBackgroundToggleClip
    | IBackgroundContentVideoData
    | IBackgroundSaveSnapshot
    | IBackgroundPopupVideoData
    | IBackgroundAutoplayClip
    ;

export interface IPopupVideoData {
    action: ActionType.POPUP_VIDEO_DATA
    payload: {
        video?: IVideoState
    }
}

export type IPopupAction = IPopupVideoData;
