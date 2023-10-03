import { createEffect, createMemo, createSignal } from "solid-js";
import { TimestampVideo } from "../interfaces";
import { Occurrence } from "../models";
import { OccurrenceFiles } from "../models/occurence-files";
import { setIsSidebarOpen } from "./sidebar.store";

export const [fileByOccurrence, setFilesByOccurrences] = createSignal<
    Array<OccurrenceFiles>
>([]);

export const [selectedOccurrenceFiles, setSelectedOccurrenceFiles] =
    createSignal<OccurrenceFiles | null>(null);

export const [isLoadingSelectedOccurrence, setIsLoadingSelectedOccurrence] =
    createSignal<boolean>(false);

createEffect(() => {
    const _selectedOccurrenceFiles = selectedOccurrenceFiles();

    if (!_selectedOccurrenceFiles) {
        return;
    }

    setSelectedOccurrence(null);
    setIsLoadingSelectedOccurrence(true);
    setIsPlaying(false);
    setIsSidebarOpen(false);

    _selectedOccurrenceFiles
        .toOccurrence()
        .then((occurrence) => {
            if (!occurrence) {
                console.error("Failed to convert OccurenceFiles to Occurence");
                return;
            }

            setIsLoadingSelectedOccurrence(false);
            setSelectedOccurrence(occurrence);
        })
        .catch((error) => {
            setIsLoadingSelectedOccurrence(false);
            console.error(
                "Error converting occurrenceFiles to Occurrence",
                error
            );
        });
});

export const [selectedOccurrence, setSelectedOccurrence] =
    createSignal<Occurrence | null>(null);

export const [currentTime, setCurrentTime] = createSignal<number>(0);
export const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

createEffect(() => {
    // on select occurence auto play the video
    setIsPlaying(true);

    const _selectedOccurence = selectedOccurrence();
    if (!_selectedOccurence) {
        return;
    }

    videosPerTime = _selectedOccurence.videosPerTime;

    const playerStartPoint = _selectedOccurence.playerStartPoint;
    const videoStartIndex = playerStartPoint.index;
    const videoStartTime = playerStartPoint.videoStartAt;
    videoKey = playerStartPoint.key;

    setSelectedTimestampIndex([videoStartIndex, videoStartTime]);
});

let videosPerTime: Record<number, TimestampVideo> | undefined;
let videoKey = 0;

export const [selectedTimestampIndex, setSelectedTimestampIndex] = createSignal<
    number[] | null
>(null);

export const [startAt, setStartAt] = createSignal<number>(0);
export const selectedVideos = createMemo<TimestampVideo | null>(() => {
    const _selectedTimestampIndex = selectedTimestampIndex();

    if (
        !_selectedTimestampIndex ||
        !Array.isArray(_selectedTimestampIndex) ||
        _selectedTimestampIndex.length === 0
    ) {
        return null;
    }

    const [index, time = 0] = _selectedTimestampIndex;
    setStartAt(time);

    const _selectedOccurence = selectedOccurrence();
    if (!_selectedOccurence || !_selectedOccurence.videosPerTime) {
        return null;
    }

    const _videosPerTime = _selectedOccurence.videosPerTime;

    const _videosKeys = Object.keys(_videosPerTime);
    if (_videosKeys.length === 0) {
        return null;
    }

    videoKey = Number(_videosKeys[index]);
    return _videosPerTime[videoKey];
});

export const [changeCurrentTime, setChangeCurrentTime] = createSignal<
    number | null
>(null);

createEffect(() => {
    const _changeCurrentTime = changeCurrentTime();
    if (_changeCurrentTime == null) {
        return;
    }

    if (!videosPerTime) {
        return;
    }

    const { index, startAt } = getVideosPerTimeIndex(
        videosPerTime,
        _changeCurrentTime
    );

    setSelectedTimestampIndex([index, startAt]);
});

function getVideosPerTimeIndex(
    timestampVideo: Record<number, TimestampVideo>,
    time: number
): { index: number; keyStamp: number; startAt: number } {
    let index = 0;
    let keyStamp = 0;
    let startAt = time;

    const keys = Object.keys(timestampVideo);

    for (const [i, value] of keys.entries()) {
        if (time >= Number(value)) {
            index = i;
            keyStamp = Number(value);
            startAt = time - Number(value);
            continue;
        }

        if (time < Number(value)) {
            break;
        }
    }

    return { index, keyStamp, startAt };
}

export function endVideoEvent() {
    console.log("endVideoEvent");
    setSelectedTimestampIndex((timestamp) => {
        console.log("endVideoEvent timestamp", timestamp);
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
