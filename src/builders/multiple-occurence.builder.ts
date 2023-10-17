import { FileEntry } from "@tauri-apps/api/fs";
import { Occurrence } from "../models";
import { OccurenceBuilder } from "./occurence.builder";

export class MultipleOccurenceBuilder {
  files: (File | FileEntry)[] = [];

  constructor() {
    return this;
  }

  addFileList(files: FileList | FileEntry[] | null): this {
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

    const occurences: Occurrence[] | undefined = await this.getAllOccurence(
      filesByFolder
    );

    return occurences;
  }

  separateFilesByFolders(): Record<string, (File | FileEntry)[]> | undefined {
    if (!this.files || this.files.length === 0) {
      return;
    }
    // separate the files into folders

    const folders: Record<string, (File | FileEntry)[]> = {};

    for (let i = 0; i < this.files.length; i++) {
      const file: File | FileEntry = this.files[i];
      let folder: string[] = [];

      if (file instanceof File) {
        folder = file.webkitRelativePath.replaceAll("\\", "/").split("/");
      } else {
        folder = file.path.replaceAll("\\", "/").split("/");
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

  private getAllOccurence(
    filesByFolder: Record<string, (File | FileEntry)[]> | undefined
  ): Promise<Occurrence[] | undefined> {
    return new Promise((resolve) => {
      // Separate the file.webkitRelativePath by folders
      if (!this.files || this.files.length === 0) {
        resolve(undefined);
      }

      if (!filesByFolder) {
        resolve(undefined);
      }

      const occurencesPromises: Promise<Occurrence | undefined>[] = [];

      for (const folderName in filesByFolder) {
        const files = filesByFolder[folderName];

        // Create a new OccurenceBuilder for each folder
        const occurence = new OccurenceBuilder().addFiles(files).build();

        if (occurence) {
          occurencesPromises.push(occurence);
        }
      }

      Promise.all(occurencesPromises).then((occurencesBuilds) => {
        const occurences = occurencesBuilds.filter((occurence) => {
          return (
            occurence &&
            occurence instanceof Occurrence &&
            occurence.duration &&
            occurence.duration > 0
          );
        }) as Occurrence[];

        resolve(occurences);
      });
    });
  }
}
