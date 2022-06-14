import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Capture } from '../entities';

@Injectable({
    providedIn: 'root',
})
export class PlayerTimelineService {
    private _player: HTMLVideoElement;

    private _capture!: Capture;

    private get _timestamps() {
        return this._capture?.timestamps;
    }
    private get _timestampsKeys(): any[] {
        return Object.keys(this._timestamps);
    }

    private _timestampKey: number = 0;
    private _timestampIndex: number = 0;
    private _timestamp$ = new BehaviorSubject<any>(null);

    private _time$ = new BehaviorSubject<number>(0);

    private _duration$ = new BehaviorSubject<number>(0);

    get videoChanges() {
        return this._timestamp$.asObservable();
    }

    get playerTimeChanges() {
        return this._time$.asObservable();
    }

    get timeChanges() {
        return this._time$.asObservable().pipe(
            map((time: number) => {
                return time + +this._timestampKey;
            })
        );
    }

    get durationChanges() {
        return this._duration$.asObservable();
    }

    constructor() {
        // Create video player
        this._player = document.createElement('video');
        // this._player.controls;
        this._player.autoplay = true;
        this._player.muted = true;

        // Hide the player
        // this._player.style['display'] = 'none';

        // Listener when time update
        this._player.addEventListener('timeupdate', () => {
            this._time$.next(this._player.currentTime);
        });

        // Listener whe video reach the end
        this._player.addEventListener('ended', () => {
            if (this._timestampsKeys.length > this._timestampIndex + 1) {
                this._timestampIndex++;
                this._timestampKey = this._timestampsKeys[this._timestampIndex];
                const nextSrc = this._timestamps[this._timestampKey];

                this._setSrc(nextSrc);
            }
        });
    }

    setCapture(capture: Capture) {
        this._capture = capture;
        this._duration$.next(capture.duration);

        if (capture.timestamps) {
            this.setTime(0);
            this._timestampKey = 0;
            this._timestampIndex = 0;

            this._setSrc(this._timestamps[0]);
        }
    }

    setTime(time: number) {
        this._player.currentTime = time;
    }

    play() {
        this._player.play();
    }

    pause() {
        this._player.pause();
    }

    // -- Private function --

    private _setSrc(timestamp: any) {
        if (timestamp) {
            this._timestamp$.next(timestamp);

            // Set src with first value finded (not array)
            this._player.src = timestamp[Object.keys(timestamp)[0]];
        }
    }
}
