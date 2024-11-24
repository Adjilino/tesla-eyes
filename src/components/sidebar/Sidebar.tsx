import { Component, For, Show, createMemo } from "solid-js";
import { OccurrenceFiles } from "../../models/occurrence-files";
import { Filter, currentFilter } from "../../stores";
import SidebarFooter from "./Footer";
import SidebarHeader from "./Header";
import styles from "./Sidebar.module.css";
import { useApp } from "../../contexts";

export interface SidebarProps {
    class: string;
}

export const Sidebar: Component<SidebarProps> = (props: SidebarProps) => {
    const app = useApp();

    function getOccurrenceDateTime(occurrenceFiles: OccurrenceFiles) {
        return (
            occurrenceFiles.getConfig()?.getDateTime()?.toLocaleString() || ""
        );
    }
    function getOccurrenceLocation(occurrenceFiles: OccurrenceFiles) {
        return occurrenceFiles.getConfig()?.getCity() || "";
    }
    async function onClickOccurrence(occurrenceFiles: OccurrenceFiles) {
        if (app) {
            app.fileByOccurrence.setSelected(occurrenceFiles);
        }
    }

    const clickOutsideSidebar = (event: MouseEvent) => {
        const sidebarContainer = document.getElementById(
            "sidebar-container"
        ) as HTMLElement;

        if (event.target === sidebarContainer && app) {
            app.sidebar.setIsOpen(false);
        }
    };

    const filteredFilesByOccurrence = createMemo(() => {
        if (!app) {
            return;
        }

        const _fileByOccurrence = app.fileByOccurrence.get();
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

    const isSidebarOpen = createMemo(() => {
        if (app) {
            return app.sidebar.isOpen();
        }

        return false;
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
                    <For each={filteredFilesByOccurrence()}>
                        {(occurrence) => (
                            <a
                                class={[
                                    "bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                                    "focus:bg-gray-200 dark:focus:bg-gray-600 focus:outline-none",
                                    "active:bg-gray-300 dark:active:bg-gray-500",
                                    "flex gap-2 rounded-md shadow-md p-2 w-full h-24",
                                    "cursor-pointer",
                                ].join(" ")}
                                onClick={() => onClickOccurrence(occurrence)}
                            >
                                <Show
                                    when={occurrence.getThumbnail()}
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
                                        src={occurrence.getThumbnail() || ""}
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
                                        {getOccurrenceLocation(occurrence) ||
                                            "Unknown location"}
                                    </span>
                                    <span
                                        class={[
                                            "dark:text-gray-400 text-gray-600",
                                            "overflow-hidden whitespace-nowrap text-ellipsis",
                                        ].join(" ")}
                                    >
                                        {getOccurrenceDateTime(occurrence) ||
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
};

export default Sidebar;
