import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Capture } from '../../entities';
import { PlayerTimelineService } from '../../services';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
    @Input()
    set capture(capture: Capture | null) {
        if (capture) {
            this._timelineService.setCapture(capture);
        }
    }

    time$ = new BehaviorSubject<string>('00:00');
    get time(): number {
        return this._time;
    }
    set time(time: number) {
        time = time || 0;

        this._time = time;
        this.timeWidth(time);
        this.time$.next(convertoToMinutes(time));
    }
    private _time = 0;

    get duration(): number {
        return this._duration;
    }
    set duration(duration: number) {
        duration = duration || 0;

        this._duration = duration;
        this.duration$.next(convertoToMinutes(duration));
    }
    private _duration = 0;
    duration$ = new BehaviorSubject<string>('00:00');

    @ViewChild('timelineProgress')
    elTimelineProgress!: ElementRef;

    private get _timelineProgress(): HTMLDivElement {
        return this.elTimelineProgress.nativeElement;
    }

    private _subscriptions$ = new Subject();

    constructor(private _timelineService: PlayerTimelineService) {}

    ngAfterViewInit(): void {
        this._timelineService.durationChanges
            .pipe(takeUntil(this._subscriptions$))
            .subscribe((duration) => {
                this.duration = duration;
            });

        this._timelineService.timeChanges
            .pipe(takeUntil(this._subscriptions$))
            .subscribe((time) => {
                this.time = time;
            });
    }

    ngOnDestroy(): void {
        this._subscriptions$.next(null);
        this._subscriptions$.complete();
    }

    private timeWidth(time: number = 0) {
        let width = 0;

        if (time) {
            width = (time * 100) / this.duration;
        }

        this._timelineProgress.style.width = `${width}%`;
    }
}

function convertoToMinutes(totalSeconds: number): string {
    // Get number of full minutes
    const minutes = Math.floor(totalSeconds / 60);

    // Get remainder of seconds
    const seconds = Math.floor(totalSeconds % 60);

    // Format as MM:SS
    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;

    function padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }
}