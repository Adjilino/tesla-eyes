import { OccurrenceBuilder } from "../builders/occurrence.builder";
import { Config } from "./config";
import { Occurrence } from "./occurrence";
import { uuidV4 } from "../utils";

export class OccurrenceFiles {
    protected id: string = uuidV4();
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
        return new OccurrenceBuilder().addFiles(this.files).build();
    }
}
