import { FileEntry } from "@tauri-apps/api/fs";
import { OccurenceFiles } from "../models/occurence-files";
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

  async build(): Promise<OccurenceFiles | undefined> {
    // build the files
    if (!this.files || this.files.length === 0) {
      return undefined;
    }

    const occurenceFiles = new OccurenceFiles();

    occurenceFiles.setFiles(this.files);

    const occurenceBuilder = new OccurenceBuilder().addFiles(this.files);

    const config = await occurenceBuilder.getOccurenceConfig();
    occurenceFiles.setConfig(config);

    const thumbnail = await occurenceBuilder.getOccurenceThumbnail();
    occurenceFiles.setThumbnail(thumbnail);

    return occurenceFiles;
  }
}
