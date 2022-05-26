import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeslaVideo } from 'entities/';

@Component({
    selector: 'folder-explorer',
    templateUrl: './folder-explorer.component.html',
    styleUrls: [],
})
export class FolderExplorerComponent {
    @Input()
    set teslaVideos(teslaVideos: TeslaVideo[] | null) {
        this.teslaVideos$.next(teslaVideos || []);
    }

    teslaVideos$ = new BehaviorSubject<TeslaVideo[]>([]);

    @Output()
    selected = new EventEmitter<TeslaVideo>();

    public open(teslaVideo: TeslaVideo) {
        this.selected.emit(teslaVideo);
    }
}
