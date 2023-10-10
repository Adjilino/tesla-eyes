import { FileEntry, readTextFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { TimestampVideo } from "../interfaces";
import {
    Config,
    Occurrence,
    PlayerStartPoint,
    VideosByCameraPosition,
} from "../models";
import { getBase64 } from "../utils";

export class OccurenceBuilder {
    videoElement = document.createElement("video");

    files: (File | FileEntry)[] = [];

    constructor() {
        this.videoElement.muted = true;
        return this;
    }

    addFiles(files: (File | FileEntry)[]) {
        // add files to the builder
        this.files = files;

        return this;
    }

    async build(): Promise<Occurrence | undefined> {
        // build the files
        if (!this.files || this.files.length === 0) {
            return;
        }

        const occurence = new Occurrence();

        occurence.directory = this.getOccurenceDirectory();
        console.log("occurrence directory", occurence.directory);

        const occurenceDateTime = this.getOccurenceDateTime();
        occurence.setDateTime(occurenceDateTime);
        console.log("occurrence date time", occurenceDateTime);

        const config = await this.getOccurenceConfig();
        occurence.setConfig(config);
        console.log("occurrence config", config);

        const thumbnail = await this.getOccurenceThumbnail();
        occurence.setThumbnail(thumbnail);
        console.log("occurrence thumbnail", thumbnail);

        const timestamp = await this.getOccurenceTimestamp();
        console.log("occurrence timestamp", timestamp);
        if (!timestamp) {
            return;
        }

        occurence.videosPerTime = timestamp?.timestampVideo || {};
        occurence.videosStartAt = timestamp?.videosStartAt || new Date();
        occurence.duration = timestamp?.duration || 0;

        // get the player config
        const playerStartPoint = await this.getPlayerStartPoint(occurence);
        occurence.playerStartPoint = playerStartPoint;
        console.log("occurrence player start point", playerStartPoint);

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

    async getOccurenceConfig(): Promise<Config | undefined> {
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
            videosStartAt: this.folderNameToDateTime(
                videoFilesSorted[0].name || ""
            ),
            timestampVideo: {} as Record<number, TimestampVideo>,
        };

        let currentDuration = 0;

        for (const file of videoFilesSorted) {
            const sourceString = await this._createSourceString(file);
            const duration = await this._getVideoDuration(sourceString);

            if (!duration) {
                continue;
            }

            let splittedPath: string[];
            if (file instanceof File) {
                splittedPath = file.webkitRelativePath
                    .replaceAll("\\", "/")
                    .split("/");
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
                if (!separatedShorts.timestampVideo[currentDuration]) {
                    separatedShorts.timestampVideo[currentDuration] = {};
                    separatedShorts.duration += duration;
                }

                switch (foundPosition) {
                    case "front":
                        if (
                            !separatedShorts.timestampVideo[currentDuration]
                                .front
                        ) {
                            separatedShorts.timestampVideo[
                                currentDuration
                            ].front = sourceString;
                        } else {
                            currentDuration = separatedShorts.duration;
                            separatedShorts.timestampVideo[currentDuration] = {
                                front: sourceString,
                            };
                            separatedShorts.duration += duration;
                        }
                        break;

                    case "back":
                        if (
                            !separatedShorts.timestampVideo[currentDuration]
                                .back
                        ) {
                            separatedShorts.timestampVideo[
                                currentDuration
                            ].back = sourceString;
                        } else {
                            currentDuration = separatedShorts.duration;
                            separatedShorts.timestampVideo[currentDuration] = {
                                back: sourceString,
                            };
                            separatedShorts.duration += duration;
                        }
                        break;

                    case "left_repeater":
                        if (
                            !separatedShorts.timestampVideo[currentDuration]
                                .left_repeater
                        ) {
                            separatedShorts.timestampVideo[
                                currentDuration
                            ].left_repeater = sourceString;
                        } else {
                            currentDuration = separatedShorts.duration;
                            separatedShorts.timestampVideo[currentDuration] = {
                                left_repeater: sourceString,
                            };
                            separatedShorts.duration += duration;
                        }
                        break;

                    case "right_repeater":
                        if (
                            !separatedShorts.timestampVideo[currentDuration]
                                .right_repeater
                        ) {
                            separatedShorts.timestampVideo[
                                currentDuration
                            ].right_repeater = sourceString;
                        } else {
                            currentDuration = separatedShorts.duration;
                            separatedShorts.timestampVideo[currentDuration] = {
                                right_repeater: sourceString,
                            };
                            separatedShorts.duration += duration;
                        }
                        break;
                }
            }
        }

        return separatedShorts;
    }
    private async _createSourceString(file: File | FileEntry): Promise<string> {
        if (file instanceof File) {
            return URL.createObjectURL(file);
        } else {
            return convertFileSrc(file.path, "asset");
        }
    }

    private async _getVideoDuration(sourceString: string): Promise<number> {
        // let notFile = "";
        // if (!(file instanceof File)) {
        //   notFile = await normalize(file.path);
        // }

        return new Promise((resolve, reject) => {
            this.videoElement.onloadedmetadata = () => {
                this.videoElement.onloadedmetadata = null;
                resolve(this.videoElement.duration);
            };

            this.videoElement.onerror = (e) => {
                console.error(`Error with the video ${sourceString}`, e);
                this.videoElement.onerror = null;
                reject();
            };

            this.videoElement.src = sourceString;
        });
    }

    async getOccurenceThumbnail(): Promise<string | undefined> {
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
        occurence: Occurrence
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

        let triggerAt =
            (dateTime.getTime() - videosStartAt.getTime()) / 1000 - 50;

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
