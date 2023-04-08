import { createMemo, createSignal } from "solid-js";
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

  const [isMouseDown, setIsMouseDown] = createSignal(false);

  const currentValue = createMemo(() => {
    // If the user is dragging the slider, we don't want to update the value
    return isMouseDown() ? 0 : currentTime();
  });  

  const changeTime = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) return;

    setChangeCurrentTime(Number(e.target.value));
  };

  return (
    <div class="h-16 p-2 flex w-full gap-2">
      <div class="flex">
        <Button onClick={() => setIsPlaying((playing) => !playing)}>
          {isPlaying() ? "Pause" : "Play"}
        </Button>
      </div>
      <div class="flex-grow overflow-hidden flex gap-2 items-center">
        <div class="w-full">
          <input
            class="w-full"
            type="range"
            min="0"
            max={maxTime()}
            value={1 || currentValue()}
            onChange={changeTime}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
          />
        </div>
      </div>
    </div>
  );
}
