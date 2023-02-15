import { Occurence } from "../models";
import { OccurenceBuilder } from "./occurence.builder";

export class MultipleOccurenceBuilder {
  files: File[] = [];

  constructor() {
    return this;
  }

  addFileList(files: FileList | null): this {
    if (!files) {
      return this;
    }

    // add files to the builder
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }

    return this;
  }

  async build(): Promise<Occurence[] | undefined> {
    // build the files

    // Separate the file.webkitRelativePath by folders
    if (!this.files || this.files.length === 0) {
      return;
    }

    const filesByFolder = this._separateFilesByFolders();

    if (!filesByFolder) {
      return;
    }

    await Object.keys(filesByFolder).forEach(async (folderName) => {
      const files = filesByFolder[folderName];

      // Create a new OccurenceBuilder for each folder
      const occurence = await new OccurenceBuilder().addFiles(files).build();
    });
  }

  private _separateFilesByFolders(): Record<string, File[]> | undefined {
    if (!this.files || this.files.length === 0) {
      return;
    }
    // separate the files into folders

    const folders: Record<string, File[]> = {};

    for (let i = 0; i < this.files.length; i++) {
      const file: File = this.files[i];
      const folder = file.webkitRelativePath.split("/");
      folder.pop();
      const folderName = folder[folder.length - 1];

      if (folders[folderName] === undefined) {
        folders[folderName] = [];
      }

      folders[folderName].push(file);
    }

    return folders;
  }
}
