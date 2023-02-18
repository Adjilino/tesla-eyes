import { VideosByCameraPosition } from "./camera-position";
import { Config } from "./config";

export class Occurence {
  private dateTime?: Date;
  private config?: Config;
  private videosByCameraPositions?: VideosByCameraPosition;
  private thumbnail?: string;

  setDateTime(dateTime: Date | undefined): void {
    this.dateTime = dateTime;
  }

  getDateTime(): Date | undefined {
    return this.dateTime;
  }

  setConfig(config: Config | undefined): void {
    this.config = config;
  }

  getConfig(): Config | undefined {
    return this.config;
  }

  setVideosByCameraPositions(
    videosByCameraPositions: VideosByCameraPosition | undefined
  ): void {
    this.videosByCameraPositions = videosByCameraPositions;
  }

  getVideosByCameraPositions(): VideosByCameraPosition | undefined {
    return this.videosByCameraPositions;
  }

  setThumbnail(thumbnail: string | undefined): void {
    this.thumbnail = thumbnail;
  }

  getThumbnail(): string | undefined {
    return this.thumbnail;
  }
}
