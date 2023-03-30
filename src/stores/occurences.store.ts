import { createEffect, createMemo, createSignal } from "solid-js";
import { Timestamp, TimestampVideo } from "../interfaces";
import { Occurence } from "../models";

export const [occurences, setOccurences] = createSignal<Occurence[]>([]);

export const [selectedOccurence, setSelectedOccurence] =
  createSignal<Occurence | null>(null);

export const selectedTimestamp = createMemo<Timestamp | null>(() => {
  const _selectedOccurence = selectedOccurence();
  if (!_selectedOccurence) {
    return null;
  }

  const date = _selectedOccurence.getDateTime();
  const recordsFrom = _selectedOccurence.timestamp?.recordsFrom;

  if (!date || !recordsFrom) {
    return null;
  }

  diff = (date.getTime() - recordsFrom.getTime()) / 1000;
  startIndex = 0;

  if (diff < 0 || diff > (_selectedOccurence.timestamp?.duration || 0)) {
    diff = 0;
  }

  const videoXpto = getTimestampVideoIndex(
    _selectedOccurence.timestamp?.timestampVideo || {},
    diff
  );

  startIndex = videoXpto.index;
  diff = videoXpto.startAt;

  return _selectedOccurence.timestamp || null;
});

let diff = 0;
let startIndex = 0;

function getTimestampVideoIndex(
  timestampVideo: Record<number, TimestampVideo>,
  time: number
): { index: number; startAt: number } {
  let index = 0;
  let startAt = 0;

  const keys = Object.keys(timestampVideo);

  for (const [i, value] of keys.entries()) {
    if (time >= Number(value)) {
      index = i;
      startAt = time - Number(value);
      continue;
    }

    if (time < Number(value)) {
      break;
    }
  }

  return { index, startAt };
}

export const [selectedTimestampIndex, setSelectedTimestampIndex] = createSignal<
  number | null
>(null);

export const selectedTimestampVideo = createMemo<TimestampVideo | null>(() => {
  const _selectedTimestampIndex = selectedTimestampIndex();
  if (_selectedTimestampIndex === null) {
    return null;
  }

  const _selectedTimestamp = selectedTimestamp();
  if (!_selectedTimestamp) {
    return null;
  }

  const _videos = Object.values(_selectedTimestamp.timestampVideo);
  if (_videos.length === 0) {
    return null;
  }

  return _videos[_selectedTimestampIndex];
});

export const [currentTime, setCurrentTime] = createSignal<number>(0);
export const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

// On select timestamp
createEffect(() => {
  // Verify if selected timestamp is not null
  const _selectedTimestamp = selectedTimestamp();
  if (!_selectedTimestamp) {
    return;
  }

  setSelectedTimestampIndex(startIndex);
});

let videos: TimestampVideo | null = null;

// On select timestamp video
createEffect(() => {
  // Verify if selected timestamp video is not null
  const _selectedTimestampVideo = selectedTimestampVideo();
  if (!_selectedTimestampVideo) {
    return;
  }

  // Remove event listeners from previous video
  if (videos) {
    removeTimestampVideoEvents(videos);
  }

  videos = _selectedTimestampVideo;

  const _timestampVideoValues = Object.values(_selectedTimestampVideo);
  if (_timestampVideoValues.length === 0) {
    return;
  }

  const firstElement = _timestampVideoValues[0];
  if (!firstElement) {
    return;
  }

  firstElement.onended = endVideoEvent;
  firstElement.ontimeupdate = ontimeupdate(firstElement);
});

// Remove all event listeners from videos
function removeTimestampVideoEvents(timestampVideo: TimestampVideo) {
  Object.values(timestampVideo).forEach((videoElement) => {
    if (!videoElement) return;
    removeVideoEventListeners(videoElement);
  });
}

// Remove event listeners from video
function removeVideoEventListeners(videoElement: HTMLVideoElement) {
  videoElement.onended = null;
  videoElement.ontimeupdate = null;

  videoElement.pause();
}

function endVideoEvent() {
  setSelectedTimestampIndex((index) => (index != null ? (index += 1) : null));
}

function ontimeupdate(element: HTMLVideoElement) {
  return () => {
    setCurrentTime(element.currentTime);
  };
}
