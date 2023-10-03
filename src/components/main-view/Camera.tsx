import { Accessor, createEffect } from "solid-js";
import {
    endVideoEvent,
    isPlaying,
    ontimeupdateEvent,
    setIsPlaying,
    startAt,
} from "../../stores";

export function Camera(props: CameraProps) {
    let isEnded = false;

    createEffect(() => {
        const source = props.source();

        // const videoElement = document.getElementById(
        //     props.id
        // ) as HTMLVideoElement;

        // videoElement.pause();

        if (source && isEnded) {
            isEnded = false;
            setIsPlaying(true);
        }
    });

    createEffect(() => {
        const _isPlaying = isPlaying();

        const videoElement = document.getElementById(
            props.id
        ) as HTMLVideoElement;

        if (!videoElement) {
            return;
        }

        if (_isPlaying) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    });

    createEffect(() => {
        const _startAt =  startAt();

        const videoElement = document.getElementById(
            props.id
        ) as HTMLVideoElement;

        if (!videoElement || !videoElement.src) {
            return;
        }

        videoElement.currentTime = _startAt
    });

    // const handlePause = () => {
    //   console.log("pause");
    //   if (isPlaying()) {
    //     setIsPlaying(false);
    //   }
    // };

    // const handlePlay = () => {
    //   console.log("play");
    //   if (!isPlaying()) {
    //     setIsPlaying(true);
    //   }
    // };

    const handleEnded = () => {
        isEnded = true;

        endVideoEvent();
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
                src={props.source()}
                muted
                autoplay
                onTimeUpdate={(event) =>
                    ontimeupdateEvent(event.target as HTMLVideoElement)
                }
                // onPlay={handlePlay}
                // onPause={handlePause}
                onEnded={() => (props.id ? handleEnded() : null)}
            />
        </a>
    );
}

interface CameraProps {
    id: string;
    source: Accessor<string | undefined>;
    isActive: boolean;
    onClick: () => void;
    class: string;
}
