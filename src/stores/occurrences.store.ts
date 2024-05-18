import { createEffect, createMemo, createSignal } from "solid-js";
import { TimestampVideo } from "../interfaces";




export function endVideoEvent() {
    setSelectedTimestampIndex((timestamp) => {
        if (timestamp === null) {
            return null;
        }

        return [(timestamp[0] += 1), 0];
    });
}

export function ontimeupdate(element: HTMLVideoElement) {
    return () => {
        setCurrentTime(videoKey + element.currentTime);
    };
}

export function ontimeupdateEvent(element: HTMLVideoElement) {
    setCurrentTime(videoKey + element.currentTime);
}
