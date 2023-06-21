import { Show, createMemo, createSignal } from "solid-js";
import {
  currentTime,
  isPlaying,
  selectedOccurence,
  setChangeCurrentTime,
  setIsPlaying,
} from "../../stores";
import { Button } from "../../ui";
import timelineStyles from "./Timelime.module.css";
import { BaseDirectory, removeDir } from "@tauri-apps/api/fs";
import { Occurence } from "../../models";

function addVideoShortcutControls() {
  window.addEventListener("keydown", (event) => {
    if (event.target !== document.body || !event.key) return;

    switch (event.key) {
      case " ":
        setIsPlaying((isPlaying) => !isPlaying);
        break;

      case "ArrowLeft":
        setChangeCurrentTime(() => {
          return currentTime() - 5;
        });
        break;

      case "ArrowRight":
        setChangeCurrentTime(() => {
          return currentTime() + 5;
        });
        break;
    }
  });
}

export function Timeline() {
  addVideoShortcutControls();

  const maxTime = createMemo(() => {
    const occurence = selectedOccurence();
    if (!occurence) return 0;

    return occurence.duration || 0;
  });

  const occuredAt = createMemo(() => {
    const occurence = selectedOccurence();
    if (!occurence) return 0;

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

    if (!timelineElement) return null;

    const rect = timelineElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.right - rect.left;
    const percent = x / width;

    return percent;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isMouseDown()) return;

    const percent = getPercent(e);

    if (percent === null) return;

    setMouseDownTimeline(percent);
  };

  const onMouseDown = (e: MouseEvent) => {
    setIsMouseDown(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    window.addEventListener("dragover", onMouseMove);
    window.addEventListener("dragend", onMouseUp);

    const percent = getPercent(e);

    if (percent === null) return;

    setMouseDownTimeline(percent);
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isMouseDown()) return;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    window.removeEventListener("dragover", onMouseMove);
    window.removeEventListener("dragend", onMouseUp);

    const percent = getPercent(e);

    if (percent === null) return;

    setChangeCurrentTime(percent * maxTime());
    setIsMouseDown(false);
  };

  const removeOccurence = (occurence: Occurence | null) => {
    if (!occurence || !occurence.directory) return;

    console.log("Removing occurence", occurence.directory);
    return

    removeDir(occurence.directory, {
      recursive: true
    });
  };

  return (
    <div class="h-16 p-2 flex w-full gap-2">
      <div class="flex">
        <Button onClick={() => setIsPlaying((playing) => !playing)}>
          <i
            class={
              "mx-2 fa-solid fa-fw " + (isPlaying() ? "fa-pause" : "fa-play")
            }
          />
        </Button>
      </div>
      <div class="flex-grow overflow-hidden relative" onMouseDown={onMouseDown}>
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
            occuredAt() ? { left: `${(occuredAt() / maxTime()) * 100}%` } : {}
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

        {/* <div class="flex align-center w-full relative">
          <div class="absolute w-full h-1 bg-slate-400" />
          <div
            class="absolute top-1 w-full h-1 bg-slate-600 transition-all duration-100"
            style={{ width: `${(currentTime() / maxTime()) * 100}%` }}
          />
          <div
            class="
              absolute w-3 h-3 bg-slate-600 
              rounded-full transition-all duration-100
            "
            style={{
              left: `calc(${(currentTime() / maxTime()) * 100}% - 12px)`,
            }}
          />
          <input
            class="absolute w-full opacity-0 cursor-pointer"
            type="range"
            min="0"
            max={maxTime()}
            value={1 || currentTime()}
            onChange={changeTime}
          /> 
        </div> */}
      </div>
      <Show when={selectedOccurence()?.directory}>
        <div class="flex">
          <Button onClick={() => removeOccurence(selectedOccurence())}>
            <i class={"mx-2 fa-solid fa-fw fa-trash"} />
          </Button>
        </div>
      </Show>
    </div>
  );
}
