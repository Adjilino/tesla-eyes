import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
    @ViewChild('videoPlayer')
    videoPlayer!: ElementRef;

    @Input()
    set sources(sources: string[]) {
        this.index = -1;
        this._sources = sources;
        this.finished();
    }
    get sources(): string[] {
        return this._sources;
    }
    private _sources!: string[];

    source!: string;

    index!: number;

    constructor(private sanitizer: DomSanitizer) {}

    sanitizeUrl(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    finished() {
        this.index++;
        if (this.sources && this.index < this.sources.length) {
            this.source = this.sources[this.index];
        }
    }
}
