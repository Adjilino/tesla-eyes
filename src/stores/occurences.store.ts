import { createEffect, createSignal } from "solid-js";
import { Timestamp, TimestampVideo } from "../interfaces";
import { Occurence } from "../models";

export const [occurences, setOccurences] = createSignal<Occurence[]>([]);

export const [selectedOccurence, setSelectedOccurence] =
  createSignal<Occurence | null>(null);

// TODO: This can be a memo
export const [selectedTimestamp, setSelectedTimestamp] =
  createSignal<Timestamp | null>(null);

export const [selectedTimestampIndex, setSelectedTimestampIndex] = createSignal<
  number | null
>(null);

export const [selectedTimestampVideo, setSelectedTimestampVideo] =
  createSignal<TimestampVideo | null>(null);

export const [currentTime, setCurrentTime] = createSignal<number>(0);
export const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

// On select occurence
createEffect(() => {
  // Verify if selected occurence is not null
  const _selectedOccurence = selectedOccurence();
  if (!_selectedOccurence) {
    return;
  }

  // Verify if timestamp is not null
  const timestamp = _selectedOccurence.timestamp;
  if (!timestamp) {
    return;
  }

  setSelectedTimestamp(timestamp);
});

// On select timestamp
createEffect(() => {
  // Verify if selected timestamp is not null
  const _selectedTimestamp = selectedTimestamp();
  if (!_selectedTimestamp) {
    return;
  }

  setSelectedTimestampIndex(0);
});

// On select timestamp index
createEffect(() => {
  // Verify if selected timestamp index is not null
  const _selectedTimestampIndex = selectedTimestampIndex();
  if (_selectedTimestampIndex === null) {
    return;
  }

  // Verify if selected timestamp is not null
  const _selectedTimestamp = selectedTimestamp();
  if (!_selectedTimestamp) {
    return;
  }

  // Verify if videos is not empty
  const _videos = Object.values(_selectedTimestamp.timestampVideo);
  if (_videos.length === 0) {
    return;
  }

  setSelectedTimestampVideo(_videos[_selectedTimestampIndex]);
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
  }
}