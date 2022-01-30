import { IMedia, IMediaClip, IMediaSnapshot, IVideoState, MediaAction } from "@syncroc/common";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

type dirtyCallback = (action: MediaAction) => void;
export interface IDirtyMedia {
    registerDirty(callback: dirtyCallback): void
    removeDirty(callback: dirtyCallback): void
    dispatchDirty(action: MediaAction): void
}

export interface IMediaBase {
    getID(): string
}

export interface IMediaPlayer extends IMediaBase {
    setTime(time: number): void
    getTime(): number
    setPlaying(playing: boolean): void
    isPlaying(): boolean
    getMediaObject(): IMedia
    playClip(clip: IMediaClip | undefined): Promise<void>
    stopClip(): void

}

export interface IMediaData extends IMediaBase {
    getTitle(): string
    getLogo(): string
    getChanel(): string
    getVideoData(): IVideoState
}

export abstract class BaseMediaPlayer implements IMediaPlayer, IDirtyMedia {
    private dirtyCallbacks: dirtyCallback[];
    private clipPlaying: boolean;

    public constructor() {
        this.dirtyCallbacks = [];
        this.clipPlaying = false;
    }

    public abstract setTime(time: number): void;
    public abstract getTime(): number;
    public abstract setPlaying(playing: boolean): void;
    public abstract isPlaying(): boolean;
    public abstract getID(): string;

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

    public async playClip(clip: IMediaClip | undefined) {
        if (clip == undefined) return;

        this.clipPlaying = true;

        let previousTime: number | null = null;
        for (let timestamp of clip) {
            if (previousTime == null) previousTime = timestamp.time;
            await sleep(timestamp.time - previousTime);
            if (!this.clipPlaying) return;
            previousTime = timestamp.time;
            this.playSnapshot(timestamp);
        }

        this.clipPlaying = false;
    }

    public stopClip() {
        this.clipPlaying = false;
    }

    public registerDirty(callback: dirtyCallback) {
        this.dirtyCallbacks.push(callback);
        callback(MediaAction.START);
    }

    public removeDirty(callback: dirtyCallback) {
        this.dirtyCallbacks = this.dirtyCallbacks.filter(cb => cb !== callback);
    }

    public dispatchDirty(action: MediaAction) {
        this.dirtyCallbacks.forEach(callback => callback(action));
    }

    public getMediaObject(): IMedia {
        return {
            time: this.getTime(),
            playing: this.isPlaying(),
            id: this.getID()
        }
    }
}

export abstract class YoutubeBase extends BaseMediaPlayer {
    protected page: HTMLElement;
    protected video: HTMLVideoElement;

    public constructor(page: HTMLElement) {
        super();
        this.page = page;
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

export class YouTubeEmbed extends YoutubeBase {
    public getID(): string {
        return "EMBED";
    }
}

export class YouTubeWatch extends YoutubeBase implements IMediaData {
    private getJSON(): {[key: string]: any} {
        let element = this.page.querySelector("#scriptTag");
        if (element == undefined) return {};

        let data = element.textContent;
        if (data == undefined) return {};

        return JSON.parse(data);
    }

    public getTitle(): string {
        let json = this.getJSON();

        return json?.name || "Lorem Ipsum";
    }

    public getLogo(): string {
        let json = this.getJSON();

        return json?.thumbnailUrl?.[0] || "";
    }

    public getChanel(): string {
        let json = this.getJSON();

        return json?.author || "John Doe";
    }

    public getID(): string {
        let json = this.getJSON();

        let id: string | undefined = undefined;
        let url = json?.embedUrl;
        if (url != undefined) {
            let urlSplit = url.split("/");
            id = urlSplit[urlSplit.length - 1];
        }

        return id || "ID";
    }

    public getVideoData(): IVideoState {
        return {
            title: this.getTitle(),
            logo: this.getLogo(),
            chanel: this.getChanel(),
            id: this.getID()
        };
    }
}
