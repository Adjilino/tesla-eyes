import { EventFile } from './event-file';
import { FileDirectory } from './file-directory';

const cameras = ['front', 'back', 'left_repeater', 'right_repeater'];

const marginSeconds = 5;

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
        try {
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

                for (const video of videos) {
                    // Verify if video have "seconds"
                    if (video.size < 128000) {
                        break;
                    }
                    // Get camera
                    let camera = this._getVideoCamera(video);

                    // Validate if is a valid video
                    if (camera) {
                        // Verify if the camera is already added to jummp to another timestamp
                        if (
                            !this.timestamps[time] ||
                            this.timestamps[time][camera]
                        ) {
                            // Time if the start of the timeline of the video
                            time = +`${this.duration}`;

                            // Create timestamp for the video
                            this.timestamps[time] = {
                                [camera]: video,
                                // await this._readFileAsUrl(video),
                            };

                            // Know duration of video
                            let _duration = await this._getVideoDuration(video);

                            // Will add the video's duration to "global" durantion
                            this.duration += _duration;
                        } else {
                            // Add the video to existing timestamp
                            this.timestamps[time][camera] = video;
                            // await this._readFileAsUrl(video);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error during set videos', error);
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
                1000 -
            marginSeconds;
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
     * @returns duration in sec of the video
     */
    private async _getVideoDuration(video: File): Promise<number> {
        let player: HTMLVideoElement = document.createElement('video');
        player.controls = true;

        // hide the player
        player.style['display'] = 'none';

        await this._loadSrc(player, video);

        const duration = player.duration;

        player.remove();

        return duration;
    }

    private async _loadSrc(player: HTMLVideoElement, video: File) {
        return new Promise((resolve, reject) => {
            if (!player) {
                reject(false);
            }

            player.onloadedmetadata = () => {
                resolve(true);
            };

            // await this._readFileAsUrl(video);
            player.src = video.path;
            player.load();
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
