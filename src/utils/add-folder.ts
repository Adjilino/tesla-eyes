import { FileEntry, readDir } from "@tauri-apps/api/fs";
import { MultipleOccurenceBuilder } from "../builders";
import { OccurenceFilesBuilder } from "../builders/occurence-files.builders";
import { setFilesByOccurrences, setIsLoadingOccurrences } from "../stores";
import { tauri } from "./tauri";
import { open } from "@tauri-apps/api/dialog";

const loadingOccurrences: boolean[] = [];

async function createMultipleOccurence(files: FileList | FileEntry[] | null) {
    if (!files) {
        return;
    }

    const separatedFilesByFolder = new MultipleOccurenceBuilder()
        .addFileList(files)
        .separateFilesByFolders();

    if (!separatedFilesByFolder) {
        return;
    }

    const folders = Object.keys(separatedFilesByFolder).sort(
        (a: string, b: string) => -a.localeCompare(b)
    );

    for (const folder of folders) {
		setIsLoadingOccurrences(true);
        loadingOccurrences.push(true);

        const files = separatedFilesByFolder[folder];

        try {
            const occurenceFiles = await new OccurenceFilesBuilder()
                .addFiles(files)
                .build();
            loadingOccurrences.pop();

            if (!occurenceFiles) {
                console.error(`Failed to create OccurenceFiles ${folder}`);
                continue;
            }

            setFilesByOccurrences((oF) => [...oF, occurenceFiles]);
        } catch (error) {
            console.error("Ops");
        }
    }

    if (loadingOccurrences.length === 0) {
        setIsLoadingOccurrences(false);
    }
}

function createFolderInput() {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = true;
    input.webkitdirectory = true;

    input.addEventListener("change", async (event) => {
        const files = (event.target as HTMLInputElement).files;

        createMultipleOccurence(files);
    });

    return input;
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

const addFolderInput = createFolderInput();

export async function addFolder() {
    if (!tauri?.tauri) {
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
    loadingOccurrences.push(true);
    // setIsLoadingOccurrences(true);

    const entries = await readDir(folder, { recursive: true });

    const files = getFiles(entries);

    loadingOccurrences.pop();
    createMultipleOccurence(files);
}
