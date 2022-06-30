import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, filter, map, Subject, takeUntil } from 'rxjs';
import { PlayerTimelineService } from '../../services';

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('videoPlayer')
    videoPlayer!: ElementRef;

    get player(): HTMLVideoElement {
        return this.videoPlayer.nativeElement as HTMLVideoElement;
    }

    @Input()
    camera!: string;

    video$ = new BehaviorSubject<File | undefined>(undefined);

    private _paused = false;

    private _subscription$ = new Subject<void>();

    constructor(private _playerService: PlayerTimelineService) {}

    ngOnInit(): void {
        this._playerService.videoChanges
            .pipe(
                takeUntil(this._subscription$),
                filter((videos) => !!videos),
                map((videos) => videos[this.camera] as File)
            )
            .subscribe((video) => {
                this.video$.next(video);
            });
    }

    ngAfterViewInit(): void {
        this.video$.asObservable().subscribe((src) => {
            this.player.src = src?.path || '';
        });

        this.player.onloadeddata = () => {
            if (this._paused) {
                this.player.pause();
            } else {
                this.player.play();
            }
        };

        this._playerService.pausedChanges
            .pipe(takeUntil(this._subscription$))
            .subscribe((paused) => {
                this._paused = paused;

                if (paused) {
                    this.player.pause();
                } else {
                    this.player.play();
                }
            });

        this._playerService.manuallyTimeChanges
            .pipe(takeUntil(this._subscription$))
            .subscribe((playerTime) => {
                this.player.currentTime = playerTime;
            });
    }

    ngOnDestroy(): void {
        this._subscription$.next();
        this._subscription$.complete();
    }
}
