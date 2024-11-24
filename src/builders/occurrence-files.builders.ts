
import { OccurrenceFiles } from "../models";
import { OccurrenceBuilder as OccurrenceBuilder } from "./occurrence.builder";

export class OccurrenceFilesBuilder {
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
            console.log('No files')
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

        const occurrenceFiles = new OccurrenceFiles();

        occurrenceFiles.setFiles(this.files);

        const occurrenceBuilder = new OccurrenceBuilder().addFiles(this.files);

        const config = await occurrenceBuilder.getOccurrenceConfig();
        occurrenceFiles.setConfig(config);

        const thumbnail = await occurrenceBuilder.getOccurrenceThumbnail();
        occurrenceFiles.setThumbnail(thumbnail);

        return occurrenceFiles;
    }
}
