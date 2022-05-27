import { Component, Input } from '@angular/core';
import { Entry } from '../../entities';

@Component({
    selector: 'preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent {
    @Input()
    set entry(entry: Entry | null | undefined) {
        this._entry = entry;

        if (entry && entry.capture) {
            const capture = entry.capture;

            if (capture.front && capture.front.length) {
                this.sources = capture.front.map((f) => f.path);
            }
        }
    }
    get entry(): Entry | null | undefined {
        return this._entry;
    }
    private _entry: Entry | null | undefined;

    // test
    public sources!: string[];
}
