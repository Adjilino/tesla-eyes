import { DomSanitizer } from '@angular/platform-browser';
import { EventFile } from './event-file';
import { FileDirectory } from './file-directory';

const cameras = ['front', 'back', 'left_repeater', 'right_repeater'];

export class Capture {
    event!: EventFile;
    thumb!: FileDirectory;

    timestamps: any = {};

    duration: number = 0;

    alert: number = 0;

    constructor(values?: any) {
        if (values) {
            this.event = values.event;

            this.thumb = values.thumb;

            this.timestamps = values.timestamps || {};

            this.duration = values.duration || 0;

            this.alert = values.alert || 0;
        }
    }

    async setVideos(videos: File[]) {
        if (videos && videos.length) {
            // Order the videos
            videos.sort((a, b) =>
                `${a.name}`
                    .toLowerCase()
                    .localeCompare(`${b.name}`.toLowerCase())
            );

            this.duration = 0;
            let time = 0;

            this._defineAlert(videos[0]);

            for (let video of videos) {
                // Get camera
                let camera = this._getVideoCamera(video);

                // Validate if is a valid video
                if (camera) {
                    // Know duration of video
                    let _duration = await this._getVideoDurantion(video);
                    console.log('_duration camera ', camera, _duration);

                    // Verify if the camera is already added to jummp to another timestamp
                    if (
                        !this.timestamps[time] ||
                        this.timestamps[time][camera]
                    ) {
                        // Time if the start of the timeline of the video
                        time = +`${this.duration}`;

                        // Create timestamp for the video
                        this.timestamps[time] = {
                            [camera]: await this._readFileAsUrl(video),
                        };

                        // Will add the video's duration to "global" durantion
                        this.duration += _duration;
                        console.log(this.duration);
                    } else {
                        // Add the video to existing timestamp
                        this.timestamps[time][camera] =
                            await this._readFileAsUrl(video);
                    }
                }
            }
        }
    }

    private _defineAlert(video: File) {
        // convert first video name in date "2022-05-01_17-16-50-back.mp4"
        let _cameraName = cameras.filter((camera) =>
            video.name.includes(camera)
        );

        const name = video.name.split(`-${_cameraName}`)[0];
        // name.replace('_', 'T');
        const dates = name.split('_');
        const date = dates[0];
        const dateTime = dates[1].replace(/-/g, ':');
        const startAt = new Date(`${date}T${dateTime}`);

        // calculate the alert point
        this.alert =
            (new Date(this.event.timestamp).getTime() - startAt.getTime()) /
            1000;
    }

    /**
     * Get the camera of the video
     *
     * @param video File of the video
     * @returns string of camera or undifined if camera as not finded
     */
    private _getVideoCamera(video: File): string | undefined {
        let _camera;

        for (let camera of cameras) {
            if (`${video.name}`.includes(camera)) {
                _camera = camera;
                return _camera;
            }
        }

        return _camera;
    }

    /**
     * Get the video duration
     *
     * @param video File of the video
     * @returns durantion in sec of the video
     */
    private async _getVideoDurantion(video: File): Promise<number> {
        let player: HTMLVideoElement = document.createElement('video');
        player.controls = true;

        // hide the player
        player.style['display'] = 'none';

        player.src = await this._readFileAsUrl(video);
        player.load();

        await this._loadSrc(player);

        const durantion = player.duration;

        player.remove();

        return durantion;
    }

    private async _loadSrc(player: HTMLVideoElement) {
        return new Promise((resolve, reject) => {
            if (!player) {
                reject(false);
            }

            player.addEventListener('loadedmetadata', () => {
                resolve(true);
            });
        });
    }

    private async _readFileAsUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                resolve(fileReader.result as string);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsDataURL(file);
        });
    }
}
