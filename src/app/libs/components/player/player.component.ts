import { Component, ElementRef, Input, ViewChild } from '@angular/core';

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

    finished() {
        this.index++;
        if (this.sources && this.index < this.sources.length) {
            this.source = this.sources[this.index];
        }
    }
}
