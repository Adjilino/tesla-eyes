import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Entry } from '../../entities';
import { SideBarService } from './side-bar.service';
import * as Electron from 'electron';

@Component({
    selector: 'side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnDestroy {
    // list os entries
    // entries will start with AD
    // TODO: Investigate every 3 entires add another AD
    entries: Entry[] = [];

    isClosed = false;

    // emit when select entry
    @Output()
    onSelectEntry = new EventEmitter<Entry>();

    private _subscriptions$ = new Subject<void>();

    constructor(private _sideBarService: SideBarService) {
        // Add one ad
        this._sideBarService
            .asObservable()
            .pipe(takeUntil(this._subscriptions$))
            .subscribe((isClosed) => {
                this.isClosed = isClosed;
            });
    }

    ngOnDestroy(): void {
        this._subscriptions$.next();
        this._subscriptions$.complete();
    }

    addEntry(entry: Entry) {
        this.entries.push(entry);
    }

    onSelect(entry: Entry) {
        this.onSelectEntry.emit(entry);
        this.close();
    }

    toggle() {
        this._sideBarService.toggle();
    }

    close() {
        this._sideBarService.close();
    }

    open() {
        this._sideBarService.open();
    }

    public openLink() {
        Electron.shell.openExternal('https://www.buymeacoffee.com/adjilino')
        // this._shell.openExternal('https://www.buymeacoffee.com/adjilino');
    }
}
