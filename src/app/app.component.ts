import { Component } from '@angular/core';
import { Entry } from './libs/entities';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'tesla-view';

    entry!: Entry;
    
    setEntry(entry: Entry) {
        this.entry = entry;
    }
}
