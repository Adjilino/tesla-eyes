import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeslaVideo } from 'src/libs/entities';

@Component({
    selector: 'file-explorer-view',
    templateUrl: './file-explorer.view.html',
    styleUrls: [],
})
export class FileExplorerView implements OnDestroy {
    teslaVideos$ = new BehaviorSubject<TeslaVideo[]>([]);

    teslaVideos: TeslaVideo[] = [];

    @Output()
    selectVideo = new EventEmitter<TeslaVideo>();

    ngOnDestroy(): void {
        this.teslaVideos$.next([]);
        this.teslaVideos$.complete();
    }

    addTeslaVideo(teslaVideo: TeslaVideo) {
        this.teslaVideos.push(teslaVideo);
        this.teslaVideos$.next(this.teslaVideos);
    }

    onSelectVideo(teslaVideo: TeslaVideo) {
        this.selectVideo.emit(teslaVideo);
    }
}
