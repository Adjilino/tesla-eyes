import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Capture, EventFile } from '../../entities';
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

            this._setAlertPosition(capture.alert || 0);
        }
    }

    public event!: EventFile;

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

    @ViewChild('timelineInput')
    elTimelineInput!: ElementRef;

    private get _timelineInput(): HTMLInputElement {
        return this.elTimelineInput.nativeElement;
    }

    @ViewChild('timelineProgress')
    elTimelineProgress!: ElementRef;

    private get _timelineProgress(): HTMLDivElement {
        return this.elTimelineProgress.nativeElement;
    }

    @ViewChild('timelineAlert')
    elTimelineAlert!: ElementRef;

    private get _timelineAlert(): HTMLDivElement {
        return this.elTimelineAlert.nativeElement;
    }

    paused = false;

    private _isPressingProgress = false;

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

        this._timelineService.pausedChanges
            .pipe(takeUntil(this._subscriptions$))
            .subscribe((paused) => {
                this.paused = paused;
            });
    }

    ngOnDestroy(): void {
        this._subscriptions$.next(null);
        this._subscriptions$.complete();
    }

    private timeWidth(time: number = 0) {
        if (!this._isPressingProgress) {
            this._timelineInput.value = `${time}`;

            this._timelineProgress.style.width = `${this._calculateWidth(
                time
            )}%`;
        }
    }

    togglePlay() {
        if (this.paused) {
            this._timelineService.play();
        } else {
            this._timelineService.pause();
        }
    }

    setPressingProgress(pressing: boolean) {
        this._isPressingProgress = pressing;
    }

    changeProgress(target: EventTarget | null) {
        if (target) {
            const inputProgress = target as HTMLInputElement;
            this._timelineService.setTime(inputProgress.valueAsNumber);
        }
    }

    private _calculateWidth(time: number = 0): number {
        let width = 0;

        if (time) {
            width = (time * 100) / this.duration;
        }

        return width;
    }

    private _setAlertPosition(alert: number = 0) {
        if (alert) {
            const width = this._calculateWidth(alert);
            const pxPerPercentage = (12 * width) / 100;

            this._timelineAlert.style.left = `calc(${width}% - ${pxPerPercentage}px`;
        }
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
