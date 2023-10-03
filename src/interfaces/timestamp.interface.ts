export interface Timestamp {
  duration: number;
  recordsFrom: Date;
  timestampVideo: Record<number, TimestampVideo>;
}

export interface TimestampVideo {
  front?: string;
  left_repeater?: string;
  right_repeater?: string;
  back?: string;
}
