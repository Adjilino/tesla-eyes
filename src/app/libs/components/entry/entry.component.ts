import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
    onSelectEntry = new EventEmitter<Entry>();

    constructor(private sanitizer: DomSanitizer) {}

    sanitizeUrl(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}
