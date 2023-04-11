import { createEffect, createMemo, createSignal } from "solid-js";
import { TimestampVideo } from "../interfaces";
import { Occurence } from "../models";

export const [occurences, setOccurences] = createSignal<Occurence[]>([]);

export const [selectedOccurence, setSelectedOccurence] =
  createSignal<Occurence | null>(null);

export const [currentTime, setCurrentTime] = createSignal<number>(0);
export const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

createEffect(() => {
  // on select occurence auto play the video
  setIsPlaying(true);

  const _selectedOccurence = selectedOccurence();
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

let videos: TimestampVideo | null = null;

const [startAt, setStartAt] = createSignal<number>(0);
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

  const _selectedOccurence = selectedOccurence();
  if (!_selectedOccurence || !_selectedOccurence.videosPerTime) {
    return null;
  }

  const _videosPerTime = _selectedOccurence.videosPerTime;

  // const _videos = Object.values(_videosPerTime);
  const _videosKeys = Object.keys(_videosPerTime);
  if (_videosKeys.length === 0) {
    return null;
  }

  // return _videos[_selectedTimestampIndex];
  videoKey = Number(_videosKeys[index]);
  return _videosPerTime[videoKey];
});

// On select timestamp video
createEffect(() => {
  // Verify if selected timestamp video is not null
  const _selectedVideos = selectedVideos();
  if (!_selectedVideos) {
    return;
  }

  // Remove event listeners from previous video
  if (videos) {
    removeVideosEvents(videos);
  }

  videos = _selectedVideos;

  const _videoCameras = Object.values(_selectedVideos);
  if (_videoCameras.length === 0) {
    return;
  }

  for (const [i, element] of _videoCameras.entries()) {
    // is first element
    if (i === 0) {
      element.onended = endVideoEvent;
      element.ontimeupdate = ontimeupdate(element);
    }
  }
});

createEffect(() => {
  const _startAt = startAt() || 0;

  if (!videos) return;

  const videoCameras = Object.values(videos);
  if (videoCameras.length === 0) return;

  for (const element of videoCameras) {
    element.currentTime = _startAt;
  }
});

createEffect(() => {
  const _isPlaying = isPlaying();
  if (!videos) {
    return;
  }

  setVideoPlaying(videos, _isPlaying);
});

export const [changeCurrentTime, setChangeCurrentTime] = createSignal<
  number | null
>(null);

createEffect(() => {
  const _changeCurrentTime = changeCurrentTime();
  if (!_changeCurrentTime) return;

  if (!videosPerTime) return;

  const { index, startAt } = getVideosPerTimeIndex(videosPerTime, _changeCurrentTime);

  setSelectedTimestampIndex([index, startAt]);
  // Prevent unnexpected run if selected occurence is changed
  // setChangeCurrentTime(null);
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

function setVideoPlaying(timestampVideo: TimestampVideo, isPlaying: boolean) {
  for (const videoElement of Object.values(timestampVideo)) {
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }
}

// Remove all event listeners from videos
function removeVideosEvents(timestampVideo: TimestampVideo) {
  for (const videoElement of Object.values(timestampVideo)) {
    if (!videoElement) return;
    removeVideoEventListeners(videoElement);
  }
}

// Remove event listeners from video
function removeVideoEventListeners(videoElement: HTMLVideoElement) {
  videoElement.onended = null;
  videoElement.ontimeupdate = null;
  videoElement.onpause = null;
  videoElement.onplay = null;

  videoElement.pause();
}

function endVideoEvent() {
  setSelectedTimestampIndex((timestamp) => {
    if (timestamp === null) return null;

    return [(timestamp[0] += 1), 0];
  });
}

function ontimeupdate(element: HTMLVideoElement) {
  return () => {
    setCurrentTime(videoKey + element.currentTime);
  };
}
