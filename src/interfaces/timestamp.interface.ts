export interface Timestamp {
  duration: number;
  recordsFrom: Date;
  timestampVideo: Record<number, TimestampVideo>;
}

export interface TimestampVideo {
  front?: HTMLVideoElement;
  left_repeater?: HTMLVideoElement;
  right_repeater?: HTMLVideoElement;
  back?: HTMLVideoElement;
}
