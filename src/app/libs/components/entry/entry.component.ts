import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Entry } from '../../entities';
import { PlayerTimelineService } from '../../services';

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

    constructor(
        private sanitizer: DomSanitizer,
        private playerService: PlayerTimelineService
    ) {}

    sanitizeUrl(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    onSelect(entry: Entry) {
        this.playerService.setCapture(entry.capture);
        this.onSelectEntry.emit(entry);
    }
}
