export interface IVideoState {
    title: string
    logo: string
    chanel: string
}

export interface IExtensionState {
    recording: boolean
}

export interface IPopupState {
    extension: IExtensionState
    video?: IVideoState
}
