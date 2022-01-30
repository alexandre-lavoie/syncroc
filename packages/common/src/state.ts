import { IMediaClip } from "./media";

export interface IPopupState {
    playing: boolean,
    recording: boolean,
    clips: IMediaClip[],
    currentClip?: IMediaClip,
    video?: IVideoState
}

export interface IPageProps {
    state: IPopupState
}

export interface IVideoState {
    title: string
    logo: string
    chanel: string,
    id: string
}
