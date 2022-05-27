import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Entry } from './libs/entities';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'tesla-view';

    entry$ = new BehaviorSubject<Entry | undefined>(undefined);
    
    setEntry(entry: Entry) {
        this.entry$.next(entry);
    }
}
