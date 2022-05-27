import { Component, EventEmitter, Output } from '@angular/core';
import { Entry } from '../../entities';

@Component({
    selector: 'side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
    // list os entries
    // entries will start with AD
    // TODO: Investigate every 3 entires add another AD
    entries: Entry[] = [];

    // emit when select entry
    @Output()
    onSelectEntry = new EventEmitter<Entry>();

    constructor() {
        // Add one ad
    }

    addEntry(entry: Entry) {
        this.entries.push(entry);
    }

    onSelect(entry: Entry) {
        this.onSelectEntry.emit(entry);
    }
}
