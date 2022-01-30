import { IExtensionState, IMediaClip, IPopupState, IVideoState } from ".";
import { IMediaSnapshot } from "./media";

export enum ContentActionType {
    START_RECORDING,
    STOP_RECORDING,
    REPLAY_RECORDING,
    GET_VIDEO_INFO
}

interface IContentStartRecording {
    action: ContentActionType.START_RECORDING
}

interface IContentStopRecording {
    action: ContentActionType.STOP_RECORDING
}

interface IContentReplayRecording {
    action: ContentActionType.REPLAY_RECORDING
    payload: {
        clip: IMediaClip
    }
}

interface IContentGetVideoInfo {
    action: ContentActionType.GET_VIDEO_INFO
}

export type IContentAction = IContentStartRecording | IContentStopRecording | IContentReplayRecording | IContentGetVideoInfo;

export enum BackgroundActionType {
    START_RECORDING,
    STOP_RECORDING,
    SAVE_RECORDING,
    REPLAY_RECORDING,
    GET_STATE,
    GET_VIDEO_INFO
}

interface IBackgroundStartRecording {
    action: BackgroundActionType.START_RECORDING
}

interface IBackgroundStopRecording {
    action: BackgroundActionType.STOP_RECORDING
}

interface IBackgroundReplayRecording {
    action: BackgroundActionType.REPLAY_RECORDING
}

export interface IBackgroundSaveRecording {
    action: BackgroundActionType.SAVE_RECORDING
    payload: {
        clip: IMediaClip
    }
}

export interface IBackgroundGetState {
    action: BackgroundActionType.GET_STATE
}

export interface IBackgroundGetVideoInfo {
    action: BackgroundActionType.GET_VIDEO_INFO
    payload: {
        video: IVideoState
    }
}

export type IBackgroundAction = IBackgroundStartRecording
    | IBackgroundReplayRecording
    | IBackgroundStopRecording
    | IBackgroundSaveRecording
    | IBackgroundGetState
    | IBackgroundGetVideoInfo
    ;

export enum PopupActionType {
    GET_STATE
}

export interface IPopupGetState {
    action: PopupActionType.GET_STATE,
    payload: {
        state: IPopupState
    }
}

export type IPopupAction = IPopupGetState;
