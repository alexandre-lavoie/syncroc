export interface IMedia {
    time: number,
    duration: number,
    playing: boolean,
    id: string
}

export enum MediaAction {
    PLAY,
    PAUSE,
    START,
    STOP,
    SEEK
}

export interface IMediaSnapshot {
    time: number,
    action: MediaAction,
    media: IMedia
}

export type IMediaClip = IMediaSnapshot[];

export function normalizeMediaClip(clip: IMediaClip): IMediaSnapshot[] {
    if (clip.length === 0) return [];

    const minTime = clip[0].time; 
    return clip.map(snapshot => ({ 
        ...snapshot, 
        time: snapshot.time - minTime 
    }));
}
