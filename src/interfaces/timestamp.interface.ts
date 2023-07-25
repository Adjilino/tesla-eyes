export interface Timestamp {
  duration: number;
  recordsFrom: Date;
  timestampVideo: Record<number, TimestampVideo>;
}

export interface TimestampVideo {
  front?: HTMLSourceElement;
  left_repeater?: HTMLSourceElement;
  right_repeater?: HTMLSourceElement;
  back?: HTMLSourceElement;
}
