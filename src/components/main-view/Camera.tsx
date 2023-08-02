import { createEffect, Accessor } from "solid-js";
import {
  isPlaying,
  ontimeupdateEvent,
  setIsPlaying,
  startAt,
} from "../../stores";

export function Camera(props: CameraProps) {
  createEffect(() => {
    const source = props.source();

    const videoElement = document.getElementById(props.id) as HTMLVideoElement;

    while (videoElement.lastChild) {
      videoElement.lastChild.remove();
    }

    if (source) {
      videoElement.appendChild(source);
      videoElement.src = source.src;
    }
  });

  createEffect(() => {
    const _isPlaying = isPlaying();

    const videoElement = document.getElementById(props.id) as HTMLVideoElement;

    if (_isPlaying) {
      videoElement.autoplay = true;
      videoElement.play();
    } else {
      videoElement.autoplay = false;
      videoElement.pause();
    }
  });

  createEffect(() => {
    const videoElement = document.getElementById(props.id) as HTMLVideoElement;

    videoElement.currentTime = startAt();
  });

  const handlePause = () => {
    if (isPlaying()) {
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (!isPlaying()) {
      setIsPlaying(true);
    }
  };

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
        onTimeUpdate={(event) =>
          ontimeupdateEvent(event.target as HTMLVideoElement)
        }
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </a>
  );
}

interface CameraProps {
  id: string;
  source: Accessor<HTMLSourceElement | undefined>;
  isActive: boolean;
  onClick: () => void;
  class: string;
}
