import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'add-entry',
    templateUrl: './add-entry.component.html',
    styleUrls: ['./add-entry.component.scss']
})
export class AddEntry {
    @Output()
    add = new EventEmitter();
}