import { FileEntry } from "@tauri-apps/api/fs";
import { OccurrenceFiles } from "../models/occurence-files";
import { OccurenceBuilder } from "./occurence.builder";

export class OccurenceFilesBuilder {
  files: Array<File | FileEntry> = [];

  constructor() {
    return this;
  }

  addFiles(files: Array<File | FileEntry>) {
    // add files to the builder
    this.files = files;

    return this;
  }

  async build(): Promise<OccurrenceFiles | undefined> {
    // build the files
    if (!this.files || this.files.length === 0) {
      return undefined;
    }

    if (!this.files.find(file => file.name?.endsWith(".mp4"))) {
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
