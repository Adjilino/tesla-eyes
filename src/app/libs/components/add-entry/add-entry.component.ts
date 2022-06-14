import {
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChildren,
} from '@angular/core';
import { Capture, Entry, EventFile, FileDirectory } from '../../entities';

@Component({
    selector: 'add-entry',
    templateUrl: './add-entry.component.html',
    styleUrls: ['./add-entry.component.scss'],
})
export class AddEntryComponent {
    @ViewChildren('directoryInput')
    directoryInput!: ElementRef;

    @Output()
    add = new EventEmitter();

    isLoading = false;

    private _file!: File;

    public async changeDirectory(files: FileList | null) {
        this.isLoading = true;

        if (files && files.length) {
            let videos: File[] = [];
            let event!: EventFile;
            let thumb!: string;

            for (let index = 0; index < files.length; index++) {
                const file = files.item(index);

                if (file) {
                    if (this.isVideo(file)) {
                        videos.push(file);
                    } else if (this.isThumb(file)) {
                        thumb = await this._readFileAsUrl(file);
                    } else if (this.isEvent(file)) {
                        event = new EventFile(
                            JSON.parse(`${await this._readFileAsText(file)}`)
                        );
                    }
                }
            }

            // Validate if is a valid capture;
            const capture = new Capture({
                event,
                thumb,
            });

            await capture.setVideos(videos);

            const entry = new Entry({
                thumb: thumb,
                type: 'tesla',
                title: capture?.event?.city || undefined,
                description: capture?.event?.timestamp
                    ? new Date(capture?.event?.timestamp)
                    : undefined,
                capture: capture,
            });

            this.add.emit(entry);
        }

        if (this.directoryInput && this.directoryInput.nativeElement) {
            this.directoryInput.nativeElement.value = '';
        }

        this.isLoading = false;
    }

    private isThumb(file: File): boolean {
        if (file.type === 'image/png' && file.name === 'thumb.png') {
            return true;
        }

        return false;
    }

    private isEvent(file: File): boolean {
        if (file.type === 'application/json' && file.name === 'event.json') {
            return true;
        }

        return false;
    }

    private isVideo(file: File): boolean {
        if (file.type === 'video/mp4') {
            return true;
        }

        return false;
    }

    private _readFileAsText(file: File) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsText(file);
        });
    }

    private _readFileAsUrl(file: File): Promise<string> {
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
