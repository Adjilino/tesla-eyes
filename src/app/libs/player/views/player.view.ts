import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeslaFile, TeslaVideo } from 'entities/';

class PlayerConfiguration {
    thumb?: TeslaFile;
    front?: TeslaFile[];
    back?: TeslaFile[];
    left?: TeslaFile[];
    right?: TeslaFile[];

    constructor() {
        this.front = [];
        this.back = [];
        this.left = [];
        this.right = [];
    }
}

@Component({
    selector: 'player-view',
    templateUrl: './player.view.html',
})
export class PlayerView {
    @Input()
    set video(video: TeslaVideo) {
        this.configurePlayer(video);
    }

    private _video?: TeslaVideo;

    public teste!: string;

    playerConfig = new BehaviorSubject<PlayerConfiguration>({});

    configurePlayer(video: TeslaVideo) {
        if (!video) {
            return;
        }

        let config = new PlayerConfiguration();

        config.thumb = video.getThumb();

        video
            .getVideos()
            ?.sort((a, b) => `${a.getName()}`.localeCompare(`${b.getName()}`))
            .forEach((v) => {
                console.log(v);
                if (!v) {
                    return;
                }

                if (v.getName()?.toLowerCase().includes('front')) {
                    config.front?.push(v);
                    if (!this.teste?.length) {
                        this.teste = v.getPath() || '';
                    }
                    return;
                }

                if (v.getName()?.toLowerCase().includes('back')) {
                    config.back?.push(v);
                    return;
                }

                if (v.getName()?.toLowerCase().includes('left')) {
                    config.left?.push(v);
                    return;
                }

                if (v.getName()?.toLowerCase().includes('right')) {
                    config.right?.push(v);
                    return;
                }
            });

        this.playerConfig.next(config);
    }
}
