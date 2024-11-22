import { OccurrenceFiles } from "../models/occurence-files";
import { OccurenceBuilder } from "./occurence.builder";

export class OccurenceFilesBuilder {
    files: Array<File | string> = [];

    constructor() {
        return this;
    }

    addFiles(files: Array<File | string>) {
        // add files to the builder
        this.files = files;

        return this;
    }

    async build(): Promise<OccurrenceFiles | undefined> {
        // build the files
        if (!this.files || this.files.length === 0) {
            return undefined;
        }

        const hasVideoFiles = this.files.find((file) => {
            if (file instanceof File) {
                return file.name?.endsWith(".mp4");
            }
            return file?.endsWith(".mp4");
        });

        if (!hasVideoFiles) {
            return undefined;
        }

        const occurenceFiles = new OccurrenceFiles();

        occurenceFiles.setFiles(this.files);

        const occurenceBuilder = new OccurenceBuilder().addFiles(this.files);

        const config = await occurenceBuilder.getOccurenceConfig();
        occurenceFiles.setConfig(config);

        const thumbnail = await occurenceBuilder.getOccurenceThumbnail();
        occurenceFiles.setThumbnail(thumbnail);

        return occurenceFiles;
    }
}
