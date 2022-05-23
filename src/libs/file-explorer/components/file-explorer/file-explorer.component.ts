import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeslaVideo } from 'src/libs/entities';

@Component({
    selector: 'file-explorer',
    templateUrl: './file-explorer.component.html',
    styleUrls: [],
})
export class FileExplorerComponent {
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
