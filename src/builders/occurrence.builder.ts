import { convertFileSrc } from "@tauri-apps/api/core";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { TimestampVideo } from "../interfaces";
import {
    Config,
    Occurrence,
    PlayerStartPoint,
    VideosByCameraPosition,
} from "../models";
import { getBase64 } from "../utils";

export class OccurrenceBuilder {
    videoElement = document.createElement("video");

    files: (File | string)[] = [];

    constructor() {
        this.videoElement.muted = true;
        this.videoElement.preload = "metadata";
        return this;
    }

    addFiles(files: (File | string)[]) {
        // add files to the builder
        this.files = files;

        return this;
    }

    async build(): Promise<Occurrence | undefined> {
        // build the files
        if (!this.files || this.files.length === 0) {
            return;
        }

        const occurrence = new Occurrence();

        occurrence.directory = this.getOccurrenceDirectory();

        const occurrenceDateTime = this.getOccurrenceDateTime();
        occurrence.setDateTime(occurrenceDateTime);

        const config = await this.getOccurrenceConfig();
        occurrence.setConfig(config);

        const thumbnail = await this.getOccurrenceThumbnail();
        occurrence.setThumbnail(thumbnail);

        const timestamp = await this.getOccurrenceTimestamp();
        if (!timestamp) {
            console.warn("build: No timestamp");
            return;
        }

        occurrence.videosPerTime = timestamp?.timestampVideo || {};
        occurrence.videosStartAt = timestamp?.videosStartAt || new Date();
        occurrence.duration = timestamp?.duration || 0;

        // get the player config
        const playerStartPoint = await this.getPlayerStartPoint(occurrence);
        occurrence.playerStartPoint = playerStartPoint;

        return occurrence;
    }

    private getOccurrenceDirectory(): string | undefined {
        if (!this.files || this.files.length === 0) {
            return;
        }

        let splittedPath: string[];

        if (this.files[0] instanceof File) {
            splittedPath = this.files[0].webkitRelativePath.split("/");
        } else {
            splittedPath = this.files[0].split("/");
        }

        if (splittedPath.length < 2) {
            return;
        }

        splittedPath.pop();

        const occurrenceDirectory = splittedPath.join("/");

        return occurrenceDirectory;
    }

    private getOccurrenceDateTime(): Date | undefined {
        if (!this.files || this.files.length === 0) {
            return;
        }

        // retrieve occurrence name from the first file
        let splittedPath;
        if (this.files[0] instanceof File) {
            splittedPath = this.files[0].webkitRelativePath
                .replaceAll("\\", "/")
                .split("/");
        } else {
            splittedPath = this.files[0].replaceAll("\\", "/").split("/");
        }

        if (splittedPath.length < 2) {
            return;
        }

        const occurrenceName = splittedPath[splittedPath.length - 2];
        const occurrenceDateTime = this.stringToDateTime(occurrenceName);

        return occurrenceDateTime;
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

        // Convert occurrence name to a date
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

    async getOccurrenceConfig(): Promise<Config | undefined> {
        if (!this.files || this.files.length === 0) {
            console.warn("No files");
            return;
        }

        const configFile = this.files.find((file) => {
            if (file instanceof File) {
                return file.name === "event.json";
            }

            return file.endsWith("event.json");
        });

        if (!configFile) {
            console.warn("Ops event.json file not found");
            return;
        }

        let configString: string;

        if (configFile instanceof File) {
            const configArrayBuffer = await configFile.arrayBuffer();
            configString = new TextDecoder("utf-8").decode(configArrayBuffer);
        } else {
            configString = await readTextFile(configFile);
        }

        const configJson = JSON.parse(configString);

        const config = new Config(configJson);

        return config;
    }

    private async getOccurrenceTimestamp(): Promise<
        | {
              duration: number;
              videosStartAt: Date | undefined;
              timestampVideo: Record<number, TimestampVideo>;
          }
        | undefined
    > {
        if (!this.files || this.files.length === 0) {
            console.warn("getOccurrenceTimestampL No videos provided");
            return;
        }

        const videoFiles = this.files.filter((file) => {
            if (file instanceof File) {
                return file.name && file.name.endsWith(".mp4");
            }

            return file.endsWith(".mp4");
        });

        if (!videoFiles || videoFiles.length === 0) {
            console.warn("getOccurrenceTimestamp: No videos found");
            return;
        }

        const videoFilesSorted = videoFiles.sort((a, b) => {
            let aName: string;
            let bName: string;

            if (a instanceof File) {
                aName = a.name;
            } else {
                aName = a;
            }
            if (b instanceof File) {
                bName = b.name;
            } else {
                bName = b;
            }

            if (!aName || !bName) {
                return 0;
            }

            return aName.localeCompare(bName);
        });

        let firstVideoFileName: string;

        if (videoFilesSorted[0] instanceof File) {
            firstVideoFileName = videoFilesSorted[0].name;
        } else {
            const _splittedPath = videoFilesSorted[0]
                .replaceAll("\\", "/")
                .split("/");
            firstVideoFileName = _splittedPath.pop() as string;
        }

        const separatedShorts = {
            duration: 0,
            videosStartAt: this.folderNameToDateTime(firstVideoFileName || ""),
            timestampVideo: {} as Record<number, TimestampVideo>,
        };

        let currentDuration = 0;

        for (const file of videoFilesSorted) {
            const sourceString = await this._createSourceString(file);
            let duration = 0;

            try {
                duration = await this._getVideoDuration(sourceString);
            } catch (error) {
                console.warn(`Video ${file} is corrupted`);
            }

            let splittedPath: string[];
            if (file instanceof File) {
                splittedPath = file.webkitRelativePath
                    .replaceAll("\\", "/")
                    .split("/");
            } else {
                splittedPath = file.replaceAll("\\", "/").split("/");
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
    private async _createSourceString(file: File | string): Promise<string> {
        if (file instanceof File) {
            return URL.createObjectURL(file);
        } else {
            return convertFileSrc(file, "asset");
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

    async getOccurrenceThumbnail(): Promise<string | undefined> {
        if (!this.files || this.files.length === 0) {
            return;
        }

        const thumbnailFile = this.files.find((file) => {
            if (file instanceof File) {
                return file.name && file.name.endsWith(".png");
            }

            return file && file.endsWith(".png");
        });

        if (!thumbnailFile) {
            return;
        }

        let thumbnailString;

        if (thumbnailFile instanceof File) {
            thumbnailString = await getBase64(thumbnailFile);
        } else {
            thumbnailString = convertFileSrc(thumbnailFile, "asset");
        }

        if (!thumbnailString) {
            return;
        }

        return thumbnailString as string;
    }

    private async getPlayerStartPoint(
        occurrence: Occurrence
    ): Promise<PlayerStartPoint> {
        const playerStartPoint = new PlayerStartPoint();

        if (!occurrence) {
            console.warn("occurrence not found");
            return playerStartPoint;
        }

        const dateTime = occurrence.getDateTime();
        const videosStartAt = occurrence.videosStartAt;

        if (!dateTime || !videosStartAt) {
            return playerStartPoint;
        }

        let triggerAt =
            (dateTime.getTime() - videosStartAt.getTime()) / 1000 - 80;

        if (triggerAt < 0 || triggerAt > (occurrence.duration || 0)) {
            triggerAt = 0;
        }

        const videoProps = this.getVideoTimeIndex(
            occurrence.videosPerTime || {},
            triggerAt
        );

        playerStartPoint.index = videoProps.index;
        playerStartPoint.key = videoProps.key;
        playerStartPoint.videoStartAt = videoProps.videoStartAt;

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
