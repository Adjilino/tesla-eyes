import { TeslaEvent } from './tesla-event';
import { TeslaFile } from './tesla-file';

export class TeslaVideo {
    private thumb?: TeslaFile;
    private videos?: TeslaFile[];
    private event?: TeslaEvent;

    constructor(values: any = {}) {
        if (values) {
            this.setThumb(values?.thumb);
            this.setVideos(values?.videos);
            this.setEvent(values?.event);
        }
    }

    public setThumb(thumb: TeslaFile): void {
        this.thumb = thumb;
    }

    public getThumb(): TeslaFile | undefined {
        return this.thumb;
    }

    public setVideos(videos: TeslaFile[] = []): void {
        this.videos = [];

        if (videos.length) {
            this.videos?.forEach((video) => {
                this.videos?.push(new TeslaFile(video));
            });
        } else {
            this.videos = videos;
        }
    }

    public getVideos(): TeslaFile[] | undefined {
        return this.videos;
    }

    public addVideos(video: TeslaFile) {
        if (!this.videos) {
            this.videos = [];
        }

        this.videos.push(video);
    }

    public setEvent(event: TeslaEvent): void {
        this.event = event;
    }

    public getEvent(): TeslaEvent | undefined {
        return this.event;
    }
}
