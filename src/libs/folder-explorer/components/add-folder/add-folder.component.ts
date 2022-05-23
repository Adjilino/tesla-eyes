import { Component, EventEmitter, Output } from '@angular/core';
import { TeslaEvent, TeslaFile, TeslaVideo } from 'src/libs/entities';

@Component({
    selector: 'add-folder',
    templateUrl: './add-folder.component.html',
    styleUrls: [],
})
export class AddFolderComponent {
    @Output()
    selectedFolder = new EventEmitter<TeslaVideo>();

    private _folder?: TeslaVideo;

    setSelectedFolder(fileList: FileList | null) {
        if (fileList && fileList.length) {
            this._folder = new TeslaVideo();

            for (let fileIndex = 0; fileIndex < fileList.length; fileIndex++) {
                const file = fileList.item(fileIndex);

                if (file) {
                    this._setThumb(file);
                    this._setEvent(file);
                    this._setVideo(file);
                }
            }
            
            if (this._folder.getThumb() && this._folder.getEvent()) {
                this.selectedFolder.emit(this._folder);
            }
        }
    }

    private _setThumb(file: File): boolean {
        if (file.type === 'image/png' && file.name === 'thumb.png') {
            this._folder?.setThumb(new TeslaFile(file));

            return true;
        }

        return false;
    }

    private _setEvent(file: File): boolean {
        if (file.type === 'application/json' && file.name === 'event.json') {
            // TODO: Read file
            this._folder?.setEvent(new TeslaEvent(file));

            return true;
        }

        return false;
    }

    private _setVideo(file: File): boolean {
        if (file.type === 'video/mp4') {
            this._folder?.addVideos(new TeslaFile(file));

            return true;
        }

        return false;
    }
}
