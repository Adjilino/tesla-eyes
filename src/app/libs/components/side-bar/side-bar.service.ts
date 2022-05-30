import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SideBarService implements OnDestroy {
    private _isClosed$ = new BehaviorSubject<boolean>(false);
    private _isClosed = false;

    private _subscriptions$ = new Subject<void>();

    ngOnDestroy(): void {
        this._subscriptions$.next();
        this._subscriptions$.complete();
    }

    open() {
        this.setClose(false);
    }

    close() {
        this.setClose(true);
    }

    toggle() {
        this.setClose(!this._isClosed);
    }

    private setClose(isClose: boolean) {
        this._isClosed = isClose;
        this._isClosed$.next(isClose);
    }

    public asObservable(): Observable<boolean> {
        return this._isClosed$.asObservable();
    }
}
