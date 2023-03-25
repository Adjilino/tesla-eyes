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

  return _selectedOccurence.timestamp || null;
});

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

  setSelectedTimestampIndex(0);
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
    console.log("remove event listeners");
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

function endVideoEvent() {
  setSelectedTimestampIndex((index) => (index != null ? (index += 1) : null));
}

function ontimeupdate(element: HTMLVideoElement) {
  return () => {
    setCurrentTime(element.currentTime);
  };
}
