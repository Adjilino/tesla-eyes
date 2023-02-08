import { Occurence } from "../models";

export class OccurenceBuilder {
  files: File[] = [];

  constructor() {
    return this;
  }

  addFiles(files: File[]) {
    // add files to the builder
    this.files = files;

    return this;
  }

  build(): Occurence | undefined {
    // build the files
    if (!this.files || this.files.length === 0) {
      return;
    }

    // retrieve the name of the occurence from the first file
    const splittedPath = this.files[0].webkitRelativePath.split("/");
    const occurenceName = splittedPath[splittedPath.length - 1];

    return;
  }
}
