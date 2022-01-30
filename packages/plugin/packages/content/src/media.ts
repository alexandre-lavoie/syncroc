import { IMedia, IMediaClip, IMediaSnapshot, MediaAction } from "@syncroc/common";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

type dirtyCallback = (action: MediaAction) => void;
export abstract class BaseMedia {
    private dirtyCallbacks: dirtyCallback[];

    public constructor() {
        this.dirtyCallbacks = [];
    }

    public abstract setTime(time: number): void;
    public abstract getTime(): number;
    public abstract getDuration(): number;
    public abstract setPlaying(playing: boolean): void;
    public abstract isPlaying(): boolean;

    public playSnapshot(snapshot: IMediaSnapshot) {
        switch (snapshot.action) {
            case MediaAction.START:
                this.setTime(snapshot.media.time);
                this.setPlaying(snapshot.media.playing);
                break;
            case MediaAction.PLAY:
                this.setPlaying(true);
                break;
            case MediaAction.PAUSE:
                this.setPlaying(false);
                break;
            case MediaAction.SEEK:
                this.setTime(snapshot.media.time);
                break;
            case MediaAction.STOP:
                this.setPlaying(false);
                break;
        }
    }

    public async playClip(clip: IMediaClip) {
        let previousTime: number | null = null;
        for (let timestamp of clip) {
            if (previousTime == null) previousTime = timestamp.time;
            await sleep(timestamp.time - previousTime);
            previousTime = timestamp.time;
            this.playSnapshot(timestamp);
        }
    }

    public registerDirty(callback: dirtyCallback) {
        this.dirtyCallbacks.push(callback);
        callback(MediaAction.START);
    }

    public removeDirty(callback: dirtyCallback) {
        this.dirtyCallbacks = this.dirtyCallbacks.filter(cb => cb !== callback);
    }

    protected dispatchDirty(action: MediaAction) {
        this.dirtyCallbacks.forEach(callback => callback(action));
    }

    public toObject(): IMedia {
        return {
            time: this.getTime(),
            duration: this.getDuration(),
            playing: this.isPlaying()
        }
    }
}

export class YouTubeVideo extends BaseMedia {
    private video: HTMLVideoElement;

    public constructor(page: HTMLElement) {
        super();
        const video = page.querySelector("video");
        if (!video) throw new Error("Cannot find video.");
        this.video = video;
        this.attachCallbacks();
    }

    private attachCallbacks() {
        this.video.addEventListener("play", (ev) => this.dispatchDirty(MediaAction.PLAY));
        this.video.addEventListener("pause", (ev) => this.dispatchDirty(MediaAction.PAUSE));
        this.video.addEventListener("seeked", (ev) => this.dispatchDirty(MediaAction.SEEK));
    }

    public setTime(time: number) {
        this.video.currentTime = time;
    }

    public getTime(): number {
        return this.video.currentTime;
    }

    public getDuration(): number {
        return this.video.duration;
    }

    public setPlaying(playing: boolean) {
        if (playing) this.video.play();
        else this.video.pause();
    }

    public isPlaying(): boolean {
        return !this.video.paused;
    }
}