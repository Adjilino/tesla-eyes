import { EventFile } from './event-file';
import { FileDirectory } from './file-directory';

const cameras = ['front', 'back', 'left_repeator', 'right_repeator'];

export class Capture {
    event!: EventFile;
    thumb!: FileDirectory;

    front: FileDirectory[] = [];
    back: FileDirectory[] = [];

    left_repeator: FileDirectory[] = [];
    set left(left_repeator: FileDirectory[]) {
        this.left_repeator = left_repeator;
    }
    get left(): FileDirectory[] {
        return this.left_repeator;
    }

    right_repeator: FileDirectory[] = [];
    set right(right_repeator: FileDirectory[]) {
        this.right_repeator = right_repeator;
    }
    get right(): FileDirectory[] {
        return this.right_repeator;
    }

    private _fileNames!: string[];

    get valid(): boolean {
        return this._valid;
    }
    private _valid: boolean = true;

    constructor(values?: any) {
        if (values) {
            this.event = values.event;
            this.thumb = values.thumb;

            this.front = [];
            if (values.front && values.front.length) {
                values.front.forEach((f: any) => {
                    this.front.push(new FileDirectory(f));
                });
            }

            this.back = [];
            if (values.back && values.back.length) {
                values.back.forEach((f: any) => {
                    this.back.push(new FileDirectory(f));
                });
            }

            this.left = [];
            if (values.left && values.left.length) {
                values.left.forEach((f: any) => {
                    this.left.push(new FileDirectory(f));
                });
            }

            this.right = [];
            if (values.right && values.right.length) {
                values.right.forEach((f: any) => {
                    this.right.push(new FileDirectory(f));
                });
            }

            if (values.videos && values.videos.length) {
                values.videos.forEach((video: any) => {
                    const v = new FileDirectory(video);

                    for (const camera of cameras) {
                        if (`${v.name}`.includes(camera)) {
                            const file = this.getCamera(camera);

                            if (file) {
                                file.push(v);
                                return;
                            }
                        }
                    }
                });
            }
        }

        this.validate();
    }

    validate() {
        this._valid = true;
        this._fileNames = [];

        // Sort the videos
        cameras.forEach((camera: any, index) => {
            this.sortFilesDirectory(camera);

            if (index === 0) {
                this.mapFilesNames(camera);
            } else if (!this._valid) {
                this._valid = this.validateCamera(camera);
            }
        });
    }

    private getCamera(camera: string) {
        const files = this[camera as keyof typeof this] as any;

        if (!files) {
            return undefined;
        }

        if (!files.length) {
            return undefined;
        }

        return files as FileDirectory[];
    }

    private sortFilesDirectory(camera: string) {
        const files = this.getCamera(camera);

        if (!files) {
            return;
        }

        files.sort((a, b) => `${a.name}`.localeCompare(`${b.name}`));
    }

    private mapFilesNames(camera: string) {
        const files = this.getCamera(camera);

        if (!files) {
            return;
        }

        if (!this._fileNames.length) {
            files.forEach((f) => {
                this._fileNames.push(f.name.replace(camera, ''));
            });
        }
    }

    private validateCamera(camera: string): boolean {
        const files = this.getCamera(camera);

        if (!files) {
            return false;
        }

        let valid = true;

        for (const name of this._fileNames) {
            if (!files.find((f) => f.name.includes(name))) {
                valid = false;

                return valid;
            }
        }

        return valid;
    }
}
