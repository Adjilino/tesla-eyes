import { confirm } from "@tauri-apps/api/dialog";
import { removeDir } from "@tauri-apps/api/fs";
import { Component, Show, createMemo, createSignal } from "solid-js";
import { Occurrence } from "../../models";
import {
    currentTime,
    isPlaying,
    setChangeCurrentTime,
    setPlaybackRate,
    setIsPlaying,
    playbackRate,
} from "../../stores";
import { Button, Dropdown } from "../../ui";
import timelineStyles from "./Timelime.module.css";
import { tauri } from "../../utils";
import { useApp } from "../../contexts";

function addVideoShortcutControls() {
    window.addEventListener("keydown", (event) => {
        if (event.target !== document.body || !event.key) {
            return;
        }

        switch (event.key) {
            case " ":
                setIsPlaying((isPlaying) => !isPlaying);
                break;

            case "ArrowLeft":
                setTimeout(() => {
                    setChangeCurrentTime(() => {
                        const time = currentTime();
                        return time > 5 ? time - 5 : 0;
                    });
                });
                break;

            case "ArrowRight":
                setTimeout(() => {
                    setChangeCurrentTime(() => {
                        const time = currentTime();
                        return (time || 0) + 5;
                    });
                });
                break;
        }
    });
}

export const Timeline: Component = () => {
    const app = useApp();

    if (!app) {
        return;
    }

    addVideoShortcutControls();

    const maxTime = createMemo(() => {
        const occurence = app.selectedOccurrence.get();
        if (!occurence) {
            return 0;
        }

        return occurence.duration || 0;
    });

    const occuredAt = createMemo(() => {
        const occurence = app.selectedOccurrence.get();
        if (!occurence) {
            return 0;
        }

        const playerStartPoint = occurence.playerStartPoint || 0;

        return playerStartPoint.key + playerStartPoint.videoStartAt;
    });

    const [isMouseDown, setIsMouseDown] = createSignal(false);
    const [mouseDownTimeline, setMouseDownTimeline] = createSignal(-1);

    const currentTimelineWidth = createMemo(() => {
        const _currentTime = currentTime();

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
        if (!isMouseDown()) {
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

        setChangeCurrentTime(percent * maxTime());
        setIsMouseDown(false);
    };

    const removeOccurence = async (occurence: Occurrence | null) => {
        if (!occurence || !occurence.directory || !tauri?.tauri) {
            return;
        }

        const confirmed = await confirm(
            `Are you sure do you want to remove the occurence "${occurence.directory}"?`,
            { title: "Delete Occurence", type: "warning" }
        );

        if (!confirmed) {
            return;
        }

        setIsPlaying(false);
        app.selectedOccurrence.set(null);

        removeDir(occurence.directory, {
            recursive: true,
        });

        if (app) {
            const _fileByOccurence = app.fileByOccurrence.get();
            const _selectedOccurrenceFile = app.fileByOccurrence.getSelected();
            if (_fileByOccurence && _selectedOccurrenceFile) {
                app.fileByOccurrence.set(
                    _fileByOccurence.filter(
                        (file) =>
                            file.getId() !== _selectedOccurrenceFile.getId()
                    )
                );
            }
        }
    };

    return (
        <div class="h-16 p-2 flex w-full gap-2">
            <div class="flex">
                <Button
                    onClick={() => setIsPlaying((playing) => !playing)}
                    class="bg-transparent dark:bg-transparent"
                >
                    <i
                        class={
                            "mx-2 fa-solid fa-fw " +
                            (isPlaying() ? "fa-pause" : "fa-play")
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
                    value={String(playbackRate())}
                    onSelect={(value) =>
                        setPlaybackRate(parseFloat(value.value))
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
                        occuredAt()
                            ? { left: `${(occuredAt() / maxTime()) * 100}%` }
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
                    window["__TAURI__"] &&
                    app.selectedOccurrence.get()?.directory
                }
            >
                <div class="flex">
                    <Button
                        onClick={() =>
                            removeOccurence(app.selectedOccurrence.get())
                        }
                    >
                        <i class={"mx-2 fa-solid fa-fw fa-trash"} />
                    </Button>
                </div>
            </Show>
        </div>
    );
};
