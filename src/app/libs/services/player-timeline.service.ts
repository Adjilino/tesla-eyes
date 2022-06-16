import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
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
    private _manuallyTime$ = new BehaviorSubject<number>(0);

    private _duration$ = new BehaviorSubject<number>(0);

    private _paused$ = new BehaviorSubject<boolean>(false);
    private _paused = false;

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

    get manuallyTimeChanges() {
        return this._manuallyTime$
            .asObservable()
            .pipe(tap((time) => (this._player.currentTime = time)));
    }

    get durationChanges() {
        return this._duration$.asObservable();
    }

    get pausedChanges() {
        return this._paused$.asObservable();
    }

    constructor() {
        // Create video player
        this._player = document.createElement('video');
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

                this._setSrcIndex(this._timestampIndex);
            }
        });

        this._player.addEventListener('pause', () => {
            this._paused$.next(true);
        });

        this._player.addEventListener('play', () => {
            this._paused$.next(false);
        });

        this._player.onloadeddata = () => {
            if (this._paused) {
                this.pause();
            } else {
                this.play();
            }
        };
    }

    setCapture(capture: Capture) {
        this._timestampIndex = -1;
        this._capture = capture;
        this._duration$.next(capture.duration);

        if (capture.timestamps) {
            this.setTime(0);
        }
    }

    setTime(time: number = 0) {
        let index = 0;

        // Get the timestamp
        for (let i = 0; this._timestampsKeys.length > i; i++) {
            if (this._timestampsKeys[i] > time) {
                break;
            }

            index = i;
        }

        const key = this._timestampsKeys[index];

        // Substract the timestamp and time to get the player time
        const playerTime = time - key;

        // this._setSrc(timestamp);
        this._setSrcIndex(index);

        this._manuallyTime$.next(playerTime);

        // player (component) need to know the time changed
    }

    play() {
        this._player.play();
    }

    pause() {
        this._player.pause();
    }

    // -- Private function --
    private _setSrcIndex(index: number = 0) {
        if (this._timestampIndex != index) {
            this._timestampIndex = index;
            this._timestampKey = this._timestampsKeys[this._timestampIndex];

            this._setSrc(this._timestamps[this._timestampKey]);
        }
    }

    private _setSrc(timestamp: any) {
        if (timestamp) {
            this._timestamp$.next(timestamp);

            // Set src with first value finded (not array)
            this._player.src = timestamp[Object.keys(timestamp)[0]];
        }
    }
}
