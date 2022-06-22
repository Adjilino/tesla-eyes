import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Capture, Entry } from '../../entities';
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

        if (entry?.capture) {
            this.capture$.next(entry.capture);
        }
    }
    get entry(): Entry | null | undefined {
        return this._entry;
    }
    private _entry: Entry | null | undefined;

    camera: string = 'front';

    capture$ = new BehaviorSubject<Capture | null>(null);

    constructor(private _sideBarService: SideBarService) {}

    setCamera(camera: string) {
        this.camera = camera;
    }

    openSideBar() {
        this._sideBarService.open();
    }
}
