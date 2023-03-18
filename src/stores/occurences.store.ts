import { createEffect, createSignal } from "solid-js";
import { Timestamp, TimestampVideo } from "../interfaces";
import { Occurence, VideosByCameraPosition } from "../models";

export const [occurences, setOccurences] = createSignal<Occurence[]>([]);

export const [selectedOccurence, setSelectedOccurence] =
  createSignal<Occurence | null>(null);

export const [selectedTimestamp, setSelectedTimestamp] =
  createSignal<Timestamp | null>(null);

export const [selectedTimestampIndex, setSelectedTimestampIndex] = createSignal<
  number | null
>(null);

export const [selectedTimestampVideo, setSelectedTimestampVideo] =
  createSignal<TimestampVideo | null>(null);

createEffect(() => {
  const _selectedOccurence = selectedOccurence();

  if (!_selectedOccurence) {
    return;
  }

  const videosByCameraPosition =
    _selectedOccurence.getVideosByCameraPositions();

  if (!videosByCameraPosition) {
    return;
  }

  const timestamp = convertVideosInTimestampsKeys(videosByCameraPosition);

  if (!timestamp) {
    return;
  }

  setSelectedTimestamp(timestamp);
});

createEffect(() => {
  const _selectedTimestamp = selectedTimestamp();
  if (!_selectedTimestamp) {
    return;
  }

  setSelectedTimestampIndex(0);
});

createEffect(() => {
  const _selectedTimestampIndex = selectedTimestampIndex();

  if (_selectedTimestampIndex === null) {
    return;
  }

  const _selectedTimestamp = selectedTimestamp();

  if (!_selectedTimestamp) {
    return;
  }

  const _videos = Object.values(_selectedTimestamp.timestamp);

  if (_videos.length === 0) {
    return;
  }

  setSelectedTimestampVideo(_videos[_selectedTimestampIndex]);
});

createEffect(() => {
  const _selectedTimestampVideo = selectedTimestampVideo();

  if (!_selectedTimestampVideo) {
    return;
  }

  _selectedTimestampVideo.front.addEventListener("ended", () => {
    console.log("ended");
    setSelectedTimestampIndex((index) => (index != null ? (index += 1) : null));
    console.log("After end, selected index: ", selectedTimestampIndex());
  });
});

function convertVideosInTimestampsKeys(
  videosByCameraPosition: VideosByCameraPosition
): Timestamp | undefined {
  if (!videosByCameraPosition) {
    return;
  }

  const videosInTimestampsKeys: Record<number, TimestampVideo> = {};

  const front = videosByCameraPosition.getFront();
  const left = videosByCameraPosition.getLeftRepeater();
  const right = videosByCameraPosition.getRightRepeater();
  const back = videosByCameraPosition.getBack();

  let currentTimestamp = 0;

  front.forEach((video, index) => {
    videosInTimestampsKeys[currentTimestamp] = {
      front: video,
      left_repeater: left[index],
      right_repeater: right[index],
      back: back[index],
    };

    currentTimestamp += video.duration;
  });

  return {
    duration: currentTimestamp,
    timestamp: videosInTimestampsKeys,
  };
}
