import { confirm } from "@tauri-apps/plugin-dialog";
import { Component, Show, createMemo, createSignal } from "solid-js";
import { Occurrence } from "../../models";
import { Button, Dropdown } from "../../ui";
import timelineStyles from "./Timeline.module.css";
import { isTauri } from "../../utils";
import { useApp, useMainView } from "../../contexts";
import { remove } from "@tauri-apps/plugin-fs";

export const Timeline: Component = () => {
    const app = useApp();
    const mainView = useMainView();

    addVideoShortcutControls();

    const maxTime = createMemo(() => {
        if (!app) {
            return 0;
        }

        const occurrence = app.selectedOccurrence.get();
        if (!occurrence) {
            return 0;
        }

        return occurrence.duration || 0;
    });

    const occurredAt = createMemo(() => {
        if (!app) {
            console.error("app not found");
            return 0;
        }

        const occurrence = app.selectedOccurrence.get();
        if (!occurrence) {
            return 0;
        }

        const playerStartPoint = occurrence.playerStartPoint || 0;

        return playerStartPoint.key + playerStartPoint.videoStartAt;
    });

    const [isMouseDown, setIsMouseDown] = createSignal(false);
    const [mouseDownTimeline, setMouseDownTimeline] = createSignal(-1);

    const currentTimelineWidth = createMemo(() => {
        if (!mainView) {
            return;
        }

        const _currentTime = mainView.currentTime.get();

        if (isMouseDown()) {
            return `${mouseDownTimeline() * 100}%`;
        }

        return `${(_currentTime / maxTime()) * 100}%`;
    });

    const getPercent = (e: MouseEvent) => {
        const timelineElement = document.getElementById("timeline");

        if (!timelineElement) {
            return null;
        }

        const rect = timelineElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.right - rect.left;
        const percent = x / width;

        return percent;
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown()) {
            return;
        }

        const percent = getPercent(e);

        if (percent === null) {
            return;
        }

        setMouseDownTimeline(percent);
    };

    const onMouseDown = (e: MouseEvent) => {
        setIsMouseDown(true);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        window.addEventListener("dragover", onMouseMove);
        window.addEventListener("dragend", onMouseUp);

        const percent = getPercent(e);

        if (percent === null) {
            return;
        }

        setMouseDownTimeline(percent);
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!isMouseDown() || !mainView) {
            return;
        }

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);

        window.removeEventListener("dragover", onMouseMove);
        window.removeEventListener("dragend", onMouseUp);

        const percent = getPercent(e);

        if (percent === null) {
            return;
        }

        mainView.changeCurrentTime.set(percent * maxTime());
        setIsMouseDown(false);
    };

    const removeOccurrence = async (occurrence: Occurrence | null) => {
        if (!occurrence || !occurrence.directory || !isTauri || !app) {
            return;
        }

        const confirmed = await confirm(
            `Are you sure do you want to remove the occurrence "${occurrence.directory}"?`,
            { title: "Delete Occurrence", kind: "warning" }
        );

        if (!confirmed) {
            return;
        }

        app.isPlaying.set(false);
        app.selectedOccurrence.set(null);
        app.sidebar.setIsOpen(true);

        remove(occurrence.directory, {
            recursive: true,
        });

        const _fileByOccurrence = app.fileByOccurrence.get();
        const _selectedOccurrenceFile = app.fileByOccurrence.getSelected();
        if (_fileByOccurrence && _selectedOccurrenceFile) {
            app.fileByOccurrence.set(
                _fileByOccurrence.filter(
                    (file) => file.getId() !== _selectedOccurrenceFile.getId()
                )
            );
        }
    };

    function addVideoShortcutControls() {
        if (!app || !mainView) {
            return;
        }

        window.addEventListener("keydown", (event) => {
            if (event.target !== document.body || !event.key) {
                return;
            }

            switch (event.key) {
                case " ":
                    app.isPlaying.set((isPlaying) => !isPlaying);
                    break;

                case "ArrowLeft":
                    setTimeout(() => {
                        mainView.changeCurrentTime.set(() => {
                            const time = mainView.changeCurrentTime.get() || 0;
                            return time > 5 ? time - 5 : 0;
                        });
                    });
                    break;

                case "ArrowRight":
                    setTimeout(() => {
                        mainView.changeCurrentTime.set(() => {
                            const time = mainView.currentTime.get();
                            return (time || 0) + 5;
                        });
                    });
                    break;
            }
        });
    }

    return (
        <Show when={app}>
            <div class="h-16 p-2 flex w-full gap-2">
                <div class="flex">
                    <Button
                        onClick={() =>
                            app &&
                            app.isPlaying.set((playing: boolean) => !playing)
                        }
                        class="bg-transparent dark:bg-transparent"
                    >
                        <i
                            class={
                                "mx-2 fa-solid fa-fw " +
                                (app && app.isPlaying.get()
                                    ? "fa-pause"
                                    : "fa-play")
                            }
                        />
                    </Button>
                </div>
                <div class="flex">
                    <Dropdown
                        class="bg-transparent dark:bg-transparent"
                        options={[
                            { label: "x0.5", value: "0.5" },
                            { label: "x0.75", value: "0.75" },
                            { label: "x1", value: "1" },
                            { label: "x1.25", value: "1.25" },
                            { label: "x1.5", value: "1.5" },
                            { label: "x2", value: "2" },
                            { label: "x4", value: "4" },
                        ]}
                        value={String(mainView && mainView.playbackRate.get())}
                        onSelect={(value) =>
                            mainView &&
                            mainView.playbackRate.set(parseFloat(value.value))
                        }
                    />
                </div>
                <div
                    class="flex-grow overflow-hidden relative"
                    onMouseDown={onMouseDown}
                >
                    <div
                        id="timeline"
                        class={`absolute ${timelineStyles.absoluteVerticalCenter} w-full h-1 bg-slate-400`}
                    />
                    <div
                        class={`
                            absolute ${timelineStyles.absoluteVerticalCenter} w-3 h-3 bg-red-600 
                            rounded-full transition-all duration-100
                        `}
                        style={
                            occurredAt()
                                ? {
                                      left: `${
                                          ((occurredAt() + 10) / maxTime()) *
                                          100
                                      }%`,
                                  }
                                : {}
                        }
                    />
                    <div
                        class={`absolute ${timelineStyles.absoluteVerticalCenter} w-full h-1 bg-slate-600 transition-all duration-100`}
                        style={{ width: currentTimelineWidth() }}
                    >
                        <div
                            class={`
                                absolute ${timelineStyles.absoluteVerticalCenter} w-2 h-2 bg-slate-600 
                                rounded-full transition-all duration-100 -right-1
                            `}
                        />
                    </div>
                </div>
                <Show
                    when={
                        isTauri &&
                        app &&
                        app.selectedOccurrence.get()?.directory
                    }
                >
                    <div class="flex">
                        <Button
                            onClick={() =>
                                app &&
                                removeOccurrence(app.selectedOccurrence.get())
                            }
                        >
                            <i class={"mx-2 fa-solid fa-fw fa-trash"} />
                        </Button>
                    </div>
                </Show>
            </div>
        </Show>
    );
};
