import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeslaVideo } from 'src/libs/entities';

@Component({
    selector: 'folder-explorer-view',
    templateUrl: './folder-explorer.view.html',
    styleUrls: [],
})
export class FolderExplorerView implements OnDestroy {
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
