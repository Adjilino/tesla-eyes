import { Input } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { takeUntil } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { Entry } from '../../entities';
import { PlayerTimelineService } from '../../services';

@Component({
    selector: 'preview-title',
    templateUrl: './preview-title.component.html',
})
export class PreviewTitleComponent implements OnInit, OnDestroy {
    @Input()
    set entry(entry: Entry | undefined) {
        this._entry = entry;
        this._timestamp =
            entry?.capture?.startAt || (entry?.description as Date);
    }
    get entry(): Entry | undefined {
        return this._entry;
    }
    private _entry?: Entry;

    timestamp$ = new BehaviorSubject<Date | undefined>(undefined);
    private _timestamp!: Date;

    private _subscriptions$ = new Subject<void>();

    constructor(private _timelineService: PlayerTimelineService) {}
    ngOnInit(): void {
        this._timelineService.timeChanges
            .pipe(
                takeUntil(this._subscriptions$),
                filter(() => !!this._timestamp)
            )
            .subscribe((time) => {
                const date = new Date(this._timestamp);
                date.setSeconds(date.getSeconds() + time);

                this.timestamp$.next(date);
            });
    }
    ngOnDestroy(): void {
        this._subscriptions$.next();
        this._subscriptions$.complete();
    }
}
