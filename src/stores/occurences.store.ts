import { createEffect, createSignal } from "solid-js";
import { Timestamp, TimestampVideo } from "../interfaces";
import { Occurence } from "../models";

export const [occurences, setOccurences] = createSignal<Occurence[]>([]);

export const [selectedOccurence, setSelectedOccurence] =
  createSignal<Occurence | null>(null);
export const [selectedTimestamp, setSelectedTimestamp] =
  createSignal<Timestamp | null>(null);

export const [selectedTimestampIndex, setSelectedTimestampIndex] = createSignal<
  number | null
>(null);

export const [currentTime, setCurrentTime] = createSignal<number>(0);
export const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

export const [selectedTimestampVideo, setSelectedTimestampVideo] =
  createSignal<TimestampVideo | null>(null);

createEffect(() => {
  const _selectedOccurence = selectedOccurence();

  if (!_selectedOccurence) {
    return;
  }

  const timestamp = _selectedOccurence.timestamp;

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

  const _videos = Object.values(_selectedTimestamp.timestampVideo);

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

  const endVideo = () => {
    console.log("ended");
    setSelectedTimestampIndex((index) => (index != null ? (index += 1) : null));
    console.log("After end, selected index: ", selectedTimestampIndex());
  };

  const frontElement = _selectedTimestampVideo.front;

  if (!frontElement) {
    return;
  }

  frontElement.onended = endVideo;

  frontElement.ontimeupdate = () => {
    setCurrentTime(frontElement.currentTime);
  };
});
