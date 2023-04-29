import { createMemo, createSignal } from "solid-js";
import {
  currentTime,
  isPlaying,
  selectedOccurence,
  setChangeCurrentTime,
  setIsPlaying,
} from "../../stores";
import { Button } from "../../ui";
import timelineStyles from "./Timelime.module.css";

export function Timeline() {
  const maxTime = createMemo(() => {
    const occurence = selectedOccurence();
    if (!occurence) return 0;

    return occurence.duration || 0;
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

    const percent = getPercent(e);

    if (percent === null) return;

    setMouseDownTimeline(percent);
  };

  const onMouseUp = (e: MouseEvent) => {
    const percent = getPercent(e);

    if (percent === null) return;

    setChangeCurrentTime(percent * maxTime());
    setIsMouseDown(false);
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
      <div
        class="flex-grow overflow-hidden relative"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <div
          id="timeline"
          class={`absolute ${timelineStyles.absoluteVerticalCenter} w-full h-1 bg-slate-400`}
        />
        <div
          class={`absolute ${timelineStyles.absoluteVerticalCenter} w-full h-1 bg-slate-600 transition-all duration-100`}
          style={{ width: currentTimelineWidth() }}
        >
          <div
            class={`
              absolute ${timelineStyles.absoluteVerticalCenter} w-3 h-3 bg-slate-600 
              rounded-full transition-all duration-100 right-0
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
    </div>
  );
}
