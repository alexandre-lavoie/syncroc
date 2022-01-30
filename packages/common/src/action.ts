import { IExtensionState, IMediaClip, IPopupState } from ".";
import { IMediaSnapshot } from "./media";

export enum ContentActionType {
    START_RECORDING,
    STOP_RECORDING,
    REPLAY_RECORDING
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

export type IContentAction = IContentStartRecording | IContentStopRecording | IContentReplayRecording;

export enum BackgroundActionType {
    START_RECORDING,
    STOP_RECORDING,
    SAVE_RECORDING,
    REPLAY_RECORDING,
    GET_STATE
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

export type IBackgroundAction = IBackgroundStartRecording | IBackgroundReplayRecording | IBackgroundStopRecording | IBackgroundSaveRecording | IBackgroundGetState;

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
