import { For, Show, createMemo } from "solid-js";
import { OccurrenceFiles } from "../../models/occurence-files";
import {
    Filter,
    currentFilter,
    fileByOccurrence,
    isSidebarOpen,
    setIsSidebarOpen,
    setSelectedOccurrenceFiles,
} from "../../stores";
import SidebarFooter from "./Footer";
import SidebarHeader from "./Header";
import styles from "./Sidebar.module.css";

export function Sidebar(props: { class: string }) {
    function getOccurrenceDateTime(occurenceFiles: OccurrenceFiles) {
        return (
            occurenceFiles.getConfig()?.getDateTime()?.toLocaleString() || ""
        );
    }
    function getOccurrenceLocation(occurenceFiles: OccurrenceFiles) {
        return occurenceFiles.getConfig()?.getCity() || "";
    }
    async function onClickOccurence(occurrenceFiles: OccurrenceFiles) {
        setSelectedOccurrenceFiles(occurrenceFiles);
    }

    const clickOutsideSidebar = (event: MouseEvent) => {
        const sidebarContainer = document.getElementById(
            "sidebar-container"
        ) as HTMLElement;

        if (event.target === sidebarContainer) {
            setIsSidebarOpen(false);
        }
    };

    const filteredFilesByOcurrence = createMemo(() => {
        const _fileByOccurrence = fileByOccurrence();
        const _filter = currentFilter();

        if (_filter === Filter.All) {
            return _fileByOccurrence;
        }

        return _fileByOccurrence.filter((occurrence) => {
            if (!occurrence.config) {
                return false;
            }

            return occurrence.config?.getReason()?.includes(_filter);
        });
    });

    return (
        <div
            id="sidebar-container"
            class={[
                props.class,
                "bg-gray-900 bg-opacity-50 dark:bg-opacity-50",
                "absolute top-0 left-0",
                "flex w-full h-[calc(100dvh)]",
                styles.sidebarContainer,
            ].join(" ")}
            classList={{
                [styles.sidebarOpen]: isSidebarOpen(),
                [styles.sidebarClosed]: !isSidebarOpen(),
            }}
            onClick={clickOutsideSidebar}
        >
            <div
                class={[
                    props.class,
                    "bg-slate-50 dark:bg-slate-900",
                    "absolute top-0 left-0",
                    "flex flex-col",
                    "rounded-md shadow-lg h-[calc(100dvh)]",
                    styles.sidebarWidth,
                ].join(" ")}
            >
                <div
                    class={
                        "h-16 p-2 flex items-center gap-2 " +
                        styles.sidebarWidth
                    }
                >
                    <SidebarHeader />
                </div>
                <div
                    class={
                        "flex-grow flex-col gap-2 p-2 flex overflow-y-auto " +
                        styles.sidebarWidth
                    }
                >
                    <For each={filteredFilesByOcurrence()}>
                        {(occurence) => (
                            <a
                                class={[
                                    "bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                                    "focus:bg-gray-200 dark:focus:bg-gray-600 focus:outline-none",
                                    "active:bg-gray-300 dark:active:bg-gray-500",
                                    "flex gap-2 rounded-md shadow-md p-2 w-full h-24",
                                    "cursor-pointer",
                                ].join(" ")}
                                onClick={() => onClickOccurence(occurence)}
                            >
                                <Show
                                    when={occurence.getThumbnail()}
                                    fallback={
                                        <div
                                            class={[
                                                "flex items-center justify-center text-ellipsis italic",
                                                styles.thumbnail,
                                            ].join(" ")}
                                        >
                                            <i class="fa-solid fa-image" />
                                        </div>
                                    }
                                >
                                    <img
                                        class={[
                                            "rounded-md",
                                            styles.thumbnail,
                                        ].join(" ")}
                                        src={occurence.getThumbnail() || ""}
                                    />
                                </Show>
                                <div
                                    class={[
                                        "flex-grow flex flex-col overflow-hidden justify-center",
                                        "text-sm text-left my-auto",
                                    ].join(" ")}
                                >
                                    <span
                                        class={[
                                            "text-ellipsis overflow-hidden whitespace-nowrap",
                                            "font-bold",
                                        ].join(" ")}
                                    >
                                        {getOccurrenceLocation(occurence) ||
                                            "Unknown location"}
                                    </span>
                                    <span
                                        class={[
                                            "dark:text-gray-400 text-gray-600",
                                            "overflow-hidden whitespace-nowrap text-ellipsis",
                                        ].join(" ")}
                                    >
                                        {getOccurrenceDateTime(occurence) ||
                                            "Unknown date"}
                                    </span>
                                </div>
                            </a>
                        )}
                    </For>
                </div>
                <div
                    class={
                        "h-16 p-2 flex items-center gap-2 " +
                        styles.sidebarWidth
                    }
                >
                    <SidebarFooter />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
