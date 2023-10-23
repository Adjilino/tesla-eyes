import { FileEntry } from "@tauri-apps/api/fs";
import { OccurenceBuilder } from "../builders/occurence.builder";
import { Config } from "./config";
import { Occurrence } from "./occurence";
import { uuidv4 } from "../utils";

export class OccurrenceFiles {
    protected id: string = uuidv4();
    files: Array<File | FileEntry> = [];
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

    setFiles(files: Array<File | FileEntry>): void {
        this.files = files;
    }
    getFiles(): Array<File | FileEntry> {
        return this.files;
    }

    toOccurrence(): Promise<Occurrence | undefined> {
        return new OccurenceBuilder().addFiles(this.files).build();
    }
}
