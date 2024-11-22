import { OccurenceBuilder } from "../builders/occurence.builder";
import { Config } from "./config";
import { Occurrence } from "./occurence";
import { uuidv4 } from "../utils";

export class OccurrenceFiles {
    protected id: string = uuidv4();
    files: Array<File | string> = [];
    config?: Config = undefined;
    thumbnail?: string | undefined = undefined;

    getId(): string {
        return this.id;
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

    setFiles(files: Array<File | string>): void {
        this.files = files;
    }
    getFiles(): Array<File | string> {
        return this.files;
    }

    toOccurrence(): Promise<Occurrence | undefined> {
        return new OccurenceBuilder().addFiles(this.files).build();
    }
}
