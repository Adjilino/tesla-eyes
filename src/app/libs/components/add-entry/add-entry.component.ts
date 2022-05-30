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

    public async changeDirectory(files: FileList | null) {
        if (files && files.length) {
            let videos: FileDirectory[] = [];
            let event!: File;
            let thumb!: FileDirectory;

            for (let index = 0; index < files.length; index++) {
                const file = files.item(index);

                if (file) {
                    if (this.isVideo(file)) {
                        videos.push(new FileDirectory(file));
                    } else if (this.isThumb(file)) {
                        thumb = new FileDirectory(file);
                    } else if (this.isEvent(file)) {
                        // await new Promise(() => {

                        // })

                        event = file;
                    }
                }
            }

            // Validate if is a valid capture;
            const capture = new Capture({
                videos,
                event,
                thumb,
            });

setTimeout(() => {
    
}, 0);
            console.log(capture.event);

            if (capture.valid) {
                const entry = new Entry({
                    thumb: thumb.path,
                    type: 'tesla',
                    title: capture?.event?.city || undefined,
                    description: capture?.event?.timestamp || undefined,
                    capture: capture,
                });

                this.add.emit(entry);
            }
        }

        if (this.directoryInput && this.directoryInput.nativeElement) {
            this.directoryInput.nativeElement.value = '';
        }
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
}
