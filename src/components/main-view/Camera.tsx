import { createEffect } from "solid-js";
import { isPlaying, ontimeupdate, ontimeupdateEvent, startAt } from "../../stores";

export function Camera(props: CameraProps) {

  createEffect(() => {
    const videoElement = document.getElementById(props.id) as HTMLVideoElement;

    if (isPlaying()) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  });

  createEffect(() => {
    const videoElement = document.getElementById(props.id) as HTMLVideoElement;

    videoElement.currentTime = startAt();
  });

  return (
    <a
      class={[
        "m-auto",
        props.isActive
          ? "flex max-w-full max-h-full"
          : `${props.class} absolute z-10 w-32 h-24 rounded-lg overflow-hidden shadow cursor-pointer`,
      ].join(" ")}
      onClick={() => props.onClick()}
    >
      <video
        id={props.id}
        ontimeupdate={(event) => ontimeupdateEvent(event.target as HTMLVideoElement)}
      />
    </a>
  );
}

interface CameraProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
  class: string;
}
