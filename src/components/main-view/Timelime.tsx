import { Button } from "../../ui";
import { isPlaying, setIsPlaying } from "../../stores";

export function Timeline() {
  return (
    <div>
      <div>
        <Button onClick={() => setIsPlaying((playing) => !playing)}>
          {isPlaying() ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  );
}
