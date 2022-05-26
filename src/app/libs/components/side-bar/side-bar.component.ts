import { Component, EventEmitter } from '@angular/core';
import { Entry } from '../../entities';

@Component({
    selector: 'side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBar {
    // list os entries
    // entries will start with AD
    // TODO: Investigate every 3 entires add another AD
    entries: Entry[] = [];

    // _____
    // emit when select entry
    onSelect = new EventEmitter<Entry>();

    constructor() {
        // Add one ad
    }
}
