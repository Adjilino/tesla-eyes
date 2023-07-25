import { FileEntry, readTextFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { TimestampVideo } from "../interfaces";
import {
  Config,
  Occurence,
  PlayerStartPoint,
  VideosByCameraPosition,
} from "../models";
import { getBase64 } from "../utils";

export class OccurenceBuilder {
  files: (File | FileEntry)[] = [];

  constructor() {
    return this;
  }

  addFiles(files: (File | FileEntry)[]) {
    // add files to the builder
    this.files = files;

    return this;
  }

  async build(): Promise<Occurence | undefined> {
    // build the files
    if (!this.files || this.files.length === 0) {
      return;
    }

    const occurence = new Occurence();

    occurence.directory = this.getOccurenceDirectory();

    const occurenceDateTime = this.getOccurenceDateTime();
    occurence.setDateTime(occurenceDateTime);

    const config = await this.getOccurenceConfig();
    occurence.setConfig(config);

    const thumbnail = await this.getOccurenceThumbnail();
    occurence.setThumbnail(thumbnail);

    const timestamp = await this.getOccurenceTimestamp();
    occurence.videosPerTime = timestamp?.timestampVideo || {};
    occurence.videosStartAt = timestamp?.videosStartAt || new Date();
    occurence.duration = timestamp?.duration || 0;

    // get the player config
    const playerStartPoint = await this.getPlayerStartPoint(occurence);
    occurence.playerStartPoint = playerStartPoint;

    return occurence;
  }

  private getOccurenceDirectory(): string | undefined {
    if (!this.files || this.files.length === 0) {
      return;
    }

    let splittedPath: string[];

    if (this.files[0] instanceof File) {
      splittedPath = this.files[0].webkitRelativePath.split("/");
    } else {
      splittedPath = this.files[0].path.split("/");
    }

    if (splittedPath.length < 2) {
      return;
    }

    splittedPath.pop();

    const occurenceDirectory = splittedPath.join("/");

    return occurenceDirectory;
  }

  private getOccurenceDateTime(): Date | undefined {
    if (!this.files || this.files.length === 0) {
      return;
    }

    // retrieve occurence name from the first file
    let splittedPath;
    if (this.files[0] instanceof File) {
      splittedPath = this.files[0].webkitRelativePath
        .replaceAll("\\", "/")
        .split("/");
    } else {
      splittedPath = this.files[0].path.replaceAll("\\", "/").split("/");
    }

    if (splittedPath.length < 2) {
      return;
    }

    const occurenceName = splittedPath[splittedPath.length - 2];

    const occurenceDateTime = this.stringToDateTime(occurenceName);

    return occurenceDateTime;
  }

  private stringToDateTime(dateTimeString: string): Date | undefined {
    // Convert date string to a valid date string
    // example of date string: 2022-07-14_11-52-29
    const dateSplitted = dateTimeString.split("_");

    const dateString = dateSplitted.shift();
    const timeStringToConvert = dateSplitted.shift();

    if (!dateString || !timeStringToConvert) {
      return;
    }

    const timeString = timeStringToConvert.split("-").join(":");

    // Convert occurence name to a date
    const dateTime = new Date(`${dateString}T${timeString}`);

    return dateTime;
  }

  private folderNameToDateTime(folderName: string): Date | undefined {
    // Convert date string to a valid date string
    // example of date string: 2022-07-14_11-52-29-front.mp4
    if (!folderName) {
      return;
    }

    const dateString = folderName.slice(0, 19);

    return this.stringToDateTime(dateString);
  }

  private async getOccurenceConfig(): Promise<Config | undefined> {
    if (!this.files || this.files.length === 0) {
      return;
    }

    const configFile = this.files.find((file) => {
      return file.name === "event.json";
    });

    if (!configFile) {
      return;
    }

    let configString: string;

    if (configFile instanceof File) {
      const configArrayBuffer = await configFile.arrayBuffer();
      configString = new TextDecoder("utf-8").decode(configArrayBuffer);
    } else {
      configString = await readTextFile(configFile.path);
    }

    const configJson = JSON.parse(configString);

    const config = new Config(configJson);

    return config;
  }

  private async getOccurenceTimestamp(): Promise<
    | {
      duration: number;
      videosStartAt: Date | undefined;
      timestampVideo: Record<number, TimestampVideo>;
    }
    | undefined
  > {
    if (!this.files || this.files.length === 0) {
      return;
    }

    const videoFiles = this.files.filter((file) => {
      return file.name && file.name.endsWith(".mp4");
    });

    if (!videoFiles || videoFiles.length === 0) {
      return;
    }

    const videoFilesSorted = videoFiles.sort((a, b) => {
      if (!a.name || !b.name) {
        return 0;
      }

      return a.name.localeCompare(b.name);
    });

    const separatedShorts = {
      duration: 0,
      videosStartAt: this.folderNameToDateTime(videoFilesSorted[0].name || ""),
      timestampVideo: {} as Record<number, TimestampVideo>,
    };

    let currentDuration = 0;

    for (const file of videoFilesSorted) {
      const sourceElement = await this._createSourceElement(file);
      const videoElement = await this._createVideoElement(sourceElement);

      let splittedPath: string[];
      if (file instanceof File) {
        splittedPath = file.webkitRelativePath.replaceAll("\\", "/").split("/");
      } else {
        splittedPath = file.path.replaceAll("\\", "/").split("/");
      }

      // get file name
      const fileName = splittedPath[splittedPath.length - 1];

      const foundPosition = VideosByCameraPosition.positions().find(
        (position) => {
          return fileName.includes(position);
        }
      );

      if (foundPosition) {
        switch (foundPosition) {
          case "front":
            separatedShorts.timestampVideo[currentDuration].front =
              sourceElement;
            break;

          case "back":
            // TODO: back video can be missing
            // make currentDuration calculation more robust
            //
            // Save the time and compare based in the file name

            currentDuration = separatedShorts.duration;
            separatedShorts.timestampVideo[currentDuration] = {
              back: sourceElement,
            };

            separatedShorts.duration += videoElement.duration;
            break;

          case "left_repeater":
            separatedShorts.timestampVideo[currentDuration].left_repeater =
              sourceElement;
            break;

          case "right_repeater":
            separatedShorts.timestampVideo[currentDuration].right_repeater =
              sourceElement;
            break;

          default:
            break;
        }
      }
    }

    return separatedShorts;
  }
  private async _createSourceElement(
    file: File | FileEntry
  ): Promise<HTMLSourceElement> {
    // let notFile = "";
    // if (!(file instanceof File)) {
    //   notFile = await normalize(file.path);
    // }

    const srcElement = document.createElement("source");

    if (file instanceof File) {
      srcElement.src = URL.createObjectURL(file);
    } else {
      srcElement.src = convertFileSrc(file.path, "asset");
    }

    return srcElement;
  }

  private async _createVideoElement(
    sourceElement: HTMLSourceElement
  ): Promise<HTMLVideoElement> {
    // let notFile = "";
    // if (!(file instanceof File)) {
    //   notFile = await normalize(file.path);
    // }

    return new Promise((resolve, reject) => {
      const videoElement = document.createElement("video");

      videoElement.onloadedmetadata = () => {
        // videoElement.onerror = null;
        resolve(videoElement);
      };

      videoElement.onerror = () => {
        console.error(`Error with the video ${file.name}`);
        reject(videoElement);
      };

      videoElement.appendChild(sourceElement);
    });
  }

  private async getOccurenceThumbnail(): Promise<string | undefined> {
    if (!this.files || this.files.length === 0) {
      return;
    }

    const thumbnailFile = this.files.find((file) => {
      return file.name && file.name.endsWith(".png");
    });

    if (!thumbnailFile) {
      return;
    }

    let thumbnailString;

    if (thumbnailFile instanceof File) {
      thumbnailString = await getBase64(thumbnailFile);
    } else {
      thumbnailString = convertFileSrc(thumbnailFile.path, "asset");
    }

    if (!thumbnailString) {
      return;
    }

    return thumbnailString as string;
  }

  private async getPlayerStartPoint(
    occurence: Occurence
  ): Promise<PlayerStartPoint> {
    const playerStartPoint = new PlayerStartPoint();

    if (!occurence) {
      return playerStartPoint;
    }

    const dateTime = occurence.getDateTime();
    const videosStartAt = occurence.videosStartAt;

    if (!dateTime || !videosStartAt) {
      return playerStartPoint;
    }

    let triggerAt = (dateTime.getTime() - videosStartAt.getTime()) / 1000 - 50;

    if (triggerAt < 0 || triggerAt > (occurence.duration || 0)) {
      triggerAt = 0;
    }

    const videoXpto = this.getVideoTimeIndex(
      occurence.videosPerTime || {},
      triggerAt
    );

    playerStartPoint.index = videoXpto.index;
    playerStartPoint.key = videoXpto.key;
    playerStartPoint.videoStartAt = videoXpto.videoStartAt;

    return playerStartPoint;
  }

  private getVideoTimeIndex(
    videosPerTime: Record<number, TimestampVideo>,
    time: number
  ): { index: number; key: number; videoStartAt: number } {
    let index = 0;
    let key = 0;
    let videoStartAt = 0;

    const keys = Object.keys(videosPerTime);

    for (const [i, value] of keys.entries()) {
      if (time >= Number(value)) {
        index = i;
        key = Number(value);
        videoStartAt = time - Number(value);
        continue;
      }

      if (time < Number(value)) {
        break;
      }
    }

    return { index, key, videoStartAt: videoStartAt };
  }
}
