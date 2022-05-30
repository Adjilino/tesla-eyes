import { Component, Input } from '@angular/core';
import { Entry } from '../../entities';
import { SideBarService } from '../side-bar';

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
                this.sources.front = capture.front.map((f) => f.path);
            }
            if (capture.back && capture.back.length) {
                this.sources.back = capture.back.map((f) => f.path);
            }
            if (capture.left && capture.left.length) {
                this.sources.left = capture.left.map((f) => f.path);
            }
            if (capture.right && capture.right.length) {
                this.sources.right = capture.right.map((f) => f.path);
            }
        }
    }
    get entry(): Entry | null | undefined {
        return this._entry;
    }
    private _entry: Entry | null | undefined;

    public sources: {
        front: string[];
        back: string[];
        left: string[];
        right: string[];
    } = {
        front: [],
        back: [],
        left: [],
        right: [],
    };

    public camera: string = 'front';

    constructor(private _sideBarService: SideBarService) {}

    setCamera(camera: string) {
        this.camera = camera;
    }

    openSideBar() {
        this._sideBarService.open();
    }
}
