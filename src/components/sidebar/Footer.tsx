import { open } from "@tauri-apps/api/dialog";
import { FileEntry, readDir } from "@tauri-apps/api/fs";
import { Show } from "solid-js";
import { MultipleOccurenceBuilder } from "../../builders";
import { OccurenceFilesBuilder } from "../../builders/occurence-files.builders";
import {
  isLoadingOccurrences,
  setFilesByOccurences,
  setIsLoadingOccurrences,
} from "../../stores";
import { Button } from "../../ui";

const loadingOccurrences: boolean[] = [];

function createFolderInput() {
  const input = document.createElement("input");

  input.type = "file";
  input.multiple = true;
  input.webkitdirectory = true;

  input.addEventListener("change", async (event) => {
    setIsLoadingOccurrences(true);

    const files = (event.target as HTMLInputElement).files;

    createMultipleOccurence(files);
  });

  return input;
}

async function createMultipleOccurence(files: FileList | FileEntry[] | null) {
  if (!files) {
    return;
  }

  const separatedFilesByFolder = new MultipleOccurenceBuilder()
    .addFileList(files)
    .separateFilesByFolders();

  for (const folder in separatedFilesByFolder) {
    loadingOccurrences.push(true);

    const files = separatedFilesByFolder[folder];

    const occurenceFiles = await new OccurenceFilesBuilder()
      .addFiles(files)
      .build();

    if (!occurenceFiles) {
      continue;
    }

    setFilesByOccurences((oF) => [...oF, occurenceFiles]);

    loadingOccurrences.pop();

    if (loadingOccurrences.length === 0) {
      setIsLoadingOccurrences(false);
    }
  }
}

export function SidebarFooter() {
  const addFolderInput = createFolderInput();

  async function addFolder() {
    if (!window?.__TAURI__?.tauri) {
      addFolderInput.click();
      return;
    }
    let folder: string | string[] | null = null;

    folder = await open({
      directory: true,
    });

    if (!folder || Array.isArray(folder)) {
      return;
    }

    const entries = await readDir(folder, { recursive: true });

    loadingOccurrences.push(true);
    setIsLoadingOccurrences(true);

    const files = getFiles(entries);

    createMultipleOccurence(files);
  }

  function getFiles(fileEntries: FileEntry[]): FileEntry[] {
    let files: FileEntry[] = [];

    for (const entry of fileEntries) {
      if (!entry.children) {
        files.push(entry);
      } else {
        files = [...files, ...getFiles(entry.children)];
      }
    }

    return files;
  }

  return (
    <div class="flex w-full align-middle justify-between truncate">
      <div>
        <Button onClick={() => addFolder()}>
          <Show when={isLoadingOccurrences()}>
            <div class="inline mr-2">
              <i class="fa-solid fa-video fa-beat-fade" />
            </div>
          </Show>
          <span class="truncate">Add folder</span>
        </Button>
      </div>

      <div class="flex items-center justify-items-center">
        <a
          class="px-2 font-semibold hover:cursor-pointer hover:underline"
          href="https://ko-fi.com/adjilino"
          target="_blank"
        >
          <i class="mr-2 fa-solid fa-fw fa-mug-hot" />
          <span class="truncate">Donate</span>
        </a>
      </div>
    </div>
  );
}

export default SidebarFooter;
