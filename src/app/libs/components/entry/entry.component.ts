import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Entry } from '../../entities';

@Component({
    selector: 'entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.scss'],
})
export class EntryComponent {
    @Input()
    entry!: Entry;

    @Output()
    onSelectEntry = new EventEmitter();
}
