import { Button } from "../../ui";
import { isPlaying, setIsPlaying } from "../../stores";

export function Timeline() {
  return (
    <div class="h-16 p-2 flex w-full gap-2">
      <div class="flex">
        <Button onClick={() => setIsPlaying((playing) => !playing)}>
          {isPlaying() ? "Pause" : "Play"}
        </Button>
      </div>
      <div class="flex-grow overflow-hidden flex gap-2 items-center">
        <div class="w-full">
          <input class="w-full" type="range" />
        </div>
      </div>
    </div>
  );
}
