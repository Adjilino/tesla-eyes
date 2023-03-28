import { Timestamp } from "../interfaces";
import { Config, Occurence, VideosByCameraPosition } from "../models";
import { getBase64 } from "../utils";

export class OccurenceBuilder {
  files: File[] = [];

  constructor() {
    return this;
  }

  addFiles(files: File[]) {
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

    const occurenceDateTime = this.getOccurenceDateTime();
    occurence.setDateTime(occurenceDateTime);

    const config = await this.getOccurenceConfig();
    occurence.setConfig(config);

    const timestamp = await this.getOccurenceTimestamp();
    occurence.timestamp = timestamp;

    const thumbnail = await this.getOccurenceThumbnail();
    occurence.setThumbnail(thumbnail);

    return occurence;
  }

  private getOccurenceDateTime(): Date | undefined {
    if (!this.files || this.files.length === 0) {
      return;
    }

    // retrieve occurence name from the first file
    const splittedPath = this.files[0].webkitRelativePath.split("/");

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
      return file.type === "application/json" && file.name === "event.json";
    });

    if (!configFile) {
      return;
    }

    const configArrayBuffer = await configFile.arrayBuffer();

    const configString = new TextDecoder("utf-8").decode(configArrayBuffer);

    const configJson = JSON.parse(configString);

    const config = new Config(configJson);

    return config;
  }

  private async getOccurenceTimestamp(): Promise<Timestamp | undefined> {
    if (!this.files || this.files.length === 0) {
      return;
    }

    const videoFiles = this.files.filter((file) => {
      return file.type.startsWith("video/");
    });

    if (!videoFiles || videoFiles.length === 0) {
      return;
    }

    const videoFilesSorted = videoFiles.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    const separatedShorts = {
      duration: 0,
      recordsFrom: this.folderNameToDateTime(videoFilesSorted[0].name),
      timestampVideo: {},
    } as Timestamp;

    let currentDuration = 0;

    for (const file of videoFilesSorted) {
      const videoElement = await this._createVideoElement(file);

      const splittedPath = file.webkitRelativePath.split("/");

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
              videoElement;
            break;

          case "back":
            currentDuration = separatedShorts.duration;
            separatedShorts.timestampVideo[currentDuration] = {
              back: videoElement,
            };

            separatedShorts.duration += videoElement.duration;
            break;

          case "left_repeater":
            separatedShorts.timestampVideo[currentDuration].left_repeater =
              videoElement;
            break;

          case "right_repeater":
            separatedShorts.timestampVideo[currentDuration].right_repeater =
              videoElement;
            break;

          default:
            break;
        }
      }
    }

    return separatedShorts;
  }

  private async _createVideoElement(file: File): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };

      videoElement.onerror = () => {
        console.error("Error durantion", videoElement.duration);
        reject(videoElement);
      };
    });
  }

  private async getOccurenceThumbnail(): Promise<string | undefined> {
    if (!this.files || this.files.length === 0) {
      return;
    }

    const thumbnailFile = this.files.find((file) => {
      return file.type.startsWith("image/");
    });

    if (!thumbnailFile) {
      return;
    }

    const thumbnailString = await getBase64(thumbnailFile);

    if (!thumbnailString) {
      return;
    }

    return thumbnailString as string;
  }
}
