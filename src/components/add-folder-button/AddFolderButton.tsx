import { Component, Show, createSignal } from "solid-js";
import { Button } from "../../ui";
import { open } from "@tauri-apps/plugin-dialog";
import { DirEntry, readDir } from "@tauri-apps/plugin-fs";
import { MultipleOccurenceBuilder } from "../../builders";
import { OccurenceFilesBuilder } from "../../builders/occurence-files.builders";
import { isTauri } from "../../utils/tauri";
import { useApp } from "../../contexts";

export interface AddFolderButtonProps {
    triggerSideBar?: boolean;
}

export const AddFolderButton: Component<AddFolderButtonProps> = (
    props: AddFolderButtonProps
) => {
    const app = useApp();

    const [isLoadingOccurrences, setIsLoadingOccurrences] = createSignal(false);

    const loadingOccurrences: boolean[] = [];

    async function createMultipleOccurence(files: FileList | string[] | null) {
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

                if (app) {
                    app.fileByOccurrence.set((oF) => [...oF, occurenceFiles]);
                }
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

    async function getFiles(
        currentPath: string,
        dirEntries: DirEntry[]
    ): Promise<string[]> {
        let files: string[] = [];

        for (const entry of dirEntries) {
            const entryPath = currentPath + "/" + entry.name;

            if (entry.isFile) {
                files.push(entryPath);
            } else {
                const _entries = await readDir(entryPath);
                files = [...files, ...(await getFiles(entryPath, _entries))];
            }
        }

        return files;
    }

    const addFolderInput = createFolderInput();

    async function addFolder() {
        if (!isTauri) {
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

        const entries = await readDir(folder);

        const files = await getFiles(folder, entries);

        loadingOccurrences.pop();
        createMultipleOccurence(files);
    }

    const addFolderClick = () => {
        if (props.triggerSideBar && app) {
            app.sidebar.setIsOpen(true);
        }

        addFolder();
    };

    return (
        <Button onClick={() => addFolderClick()}>
            <Show when={isLoadingOccurrences()}>
                <div class="inline mr-2">
                    <i class="fa-solid fa-video fa-beat-fade" />
                </div>
            </Show>
            <span class="truncate">Add folder</span>
        </Button>
    );
};
