import { Occurrence } from "../models";
import { OccurrenceBuilder as OccurrenceBuilder } from "./occurrence.builder";

export class MultipleOccurrenceBuilder {
  files: (File | string)[] = [];

  constructor() {
    return this;
  }

  addFileList(files: FileList | string[] | null): this {
    if (!files) {
      return this;
    }

    // add files to the builder
    this.files.push(...files);

    return this;
  }

  async build(): Promise<Occurrence[] | undefined> {
    // build the files

    // Separate the file.webkitRelativePath by folders
    if (!this.files || this.files.length === 0) {
      return;
    }

    const filesByFolder = this.separateFilesByFolders();

    if (!filesByFolder) {
      return;
    }

    const occurrences: Occurrence[] | undefined = await this.getAllOccurrence(
      filesByFolder
    );

    return occurrences;
  }

  separateFilesByFolders(): Record<string, (File | string)[]> | undefined {
    if (!this.files || this.files.length === 0) {
      return;
    }
    // separate the files into folders

    const folders: Record<string, (File | string)[]> = {};

    for (let i = 0; i < this.files.length; i++) {
      const file: File | string = this.files[i];
      let folder: string[] = [];

      if (file instanceof File) {
        folder = file.webkitRelativePath.replaceAll("\\", "/").split("/");
      } else {
        folder = file.replaceAll("\\", "/").split("/");
      }

      folder.pop();
      const folderName = folder[folder.length - 1];

      if (folders[folderName] === undefined) {
        folders[folderName] = [];
      }

      folders[folderName].push(file);
    }

    return folders;
  }

  private getAllOccurrence(
    filesByFolder: Record<string, (File | string)[]> | undefined
  ): Promise<Occurrence[] | undefined> {
    return new Promise((resolve) => {
      // Separate the file.webkitRelativePath by folders
      if (!this.files || this.files.length === 0) {
        resolve(undefined);
      }

      if (!filesByFolder) {
        resolve(undefined);
      }

      const occurrencesPromises: Promise<Occurrence | undefined>[] = [];

      for (const folderName in filesByFolder) {
        const files = filesByFolder[folderName];

        // Create a new OccurrenceBuilder for each folder
        const occurrence = new OccurrenceBuilder().addFiles(files).build();

        if (occurrence) {
          occurrencesPromises.push(occurrence);
        }
      }

      Promise.all(occurrencesPromises).then((occurrencesBuilds) => {
        const occurrences = occurrencesBuilds.filter((occurrence) => {
          return (
            occurrence &&
            occurrence instanceof Occurrence &&
            occurrence.duration &&
            occurrence.duration > 0
          );
        }) as Occurrence[];

        resolve(occurrences);
      });
    });
  }
}
