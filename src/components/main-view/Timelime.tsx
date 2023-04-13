import { createMemo } from "solid-js";
import {
  currentTime,
  isPlaying,
  selectedOccurence,
  setChangeCurrentTime,
  setIsPlaying,
} from "../../stores";
import { Button } from "../../ui";

export function Timeline() {
  const maxTime = createMemo(() => {
    const occurence = selectedOccurence();
    if (!occurence) return 0;

    return occurence.duration || 0;
  });

  const changeTime = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) return;

    setChangeCurrentTime(Number(e.target.value));
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
      <div class="flex-grow overflow-hidden flex gap-2 items-center">
        <div class="flex align-center w-full relative">
          <div class="absolute top-1 w-full h-1 bg-slate-400" />
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
        </div>
      </div>
    </div>
  );
}
