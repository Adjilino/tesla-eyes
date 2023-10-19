import { Component, Show } from "solid-js";
import { isLoadingSelectedOccurrence } from "../../stores";
import { tauri } from "../../utils";
import { open } from "@tauri-apps/api/shell";

const LoadingOccurrence: Component = () => {
    return (
        <div class="flex flex-col">
            <p class="text-2xl mb-2 text-gray-600 dark:text-gray-400">
                Loading occurrence
                <i class="mx-2 fa-solid fa-fw fa-xs fa-spinner animate-spin" />
            </p>
        </div>
    );
};

const NoOccurenceSelect: Component = () => {
    const sampleUrl = "https://mega.nz/folder/4MARkZKY#7gc5e3ZqoAKrnL4E56oS0Q";

    const openSample = () => {
        if (tauri) {
            open(sampleUrl);
        } else {
            window.open(sampleUrl);
        }
    };

    return (
        <Show
            when={!isLoadingSelectedOccurrence()}
            fallback={<LoadingOccurrence />}
        >
            <div class="flex flex-col">
                <p class="text-2xl mb-2 text-gray-600 dark:text-gray-400">
                    Nothing selected
                </p>
                <p class="text-xl text-gray-600 dark:text-gray-400">
                    1. Open sidebar
                    <i class="mx-2 fa-solid fa-fw fa-xs fa-bars" />
                </p>
                <p class="text-xl text-gray-600 dark:text-gray-400">
                    2. Click 'Add folder'
                </p>
                <p class="text-xl text-gray-600 dark:text-gray-400">
                    3. Select folder occurrence from your Telsa
                </p>
                <p class="text-xl text-gray-600 dark:text-gray-400">
                    4. The occurence will be added to the sidebar
                </p>
                <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">
                    5. Select occurence from the sidebar and enjoy!
                </p>
                <hr />
                <p class="text-xl text-gray-600 dark:text-gray-400 mt-2">
                    You can try it with the example folder.&nbsp;
                    <a
                        class="underline underline-offset-2 cursor-pointer"
                        onClick={() => openSample()}
                    >
                        Click here to download it.
                    </a>
                </p>
            </div>
        </Show>
    );
};

export default NoOccurenceSelect;
