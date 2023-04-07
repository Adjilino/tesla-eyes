import { TimestampVideo } from "../interfaces";
import { Config } from "./config";
import { PlayerStartPoint } from "./player-start-point";

export class Occurence {
  // information
  private dateTime?: Date;
  private config?: Config;
  private thumbnail?: string;

  // videos
  public videosPerTime?: Record<number, TimestampVideo>;
  public videosStartAt?: Date;
  public duration?: number;

  // player
  public playerStartPoint: PlayerStartPoint = new PlayerStartPoint();

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

  setThumbnail(thumbnail: string | undefined): void {
    this.thumbnail = thumbnail;
  }

  getThumbnail(): string | undefined {
    return this.thumbnail;
  }
}
