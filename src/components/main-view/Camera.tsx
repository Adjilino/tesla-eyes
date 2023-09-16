import { createEffect, Accessor, For } from "solid-js";
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

        const videoElement = document.getElementById(
            props.id
        ) as HTMLVideoElement;

        // while (videoElement.lastChild) {
        //     videoElement.lastChild.remove();
        // }

        if (source) {
            videoElement.src = source.src;
            console.log("source.src", source.src);
            // videoElement.appendChild(source);
            // videoElement.load();
            // videoElement.addEventListener("change", () => {
            //     console.log("change");
            // });

            if (isEnded) {
                isEnded = false;
                setIsPlaying(true);
            }
        } else {
            // No source for current selected time
            videoElement.src = "";
        }
    });

    createEffect(() => {
        const _isPlaying = isPlaying();

        const videoElement = document.getElementById(
            props.id
        ) as HTMLVideoElement;

        if (_isPlaying) {
            videoElement.autoplay = true;
            videoElement.play();
        } else {
            console.log("pause", props.id);
            videoElement.autoplay = false;
            videoElement.pause();
        }
    });

    createEffect(() => {
        const videoElement = document.getElementById(
            props.id
        ) as HTMLVideoElement;

        videoElement.currentTime = startAt();
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
                onTimeUpdate={(event) =>
                    ontimeupdateEvent(event.target as HTMLVideoElement)
                }
                // onPlay={handlePlay}
                // onPause={handlePause}
                onEnded={() => (props.id ? handleEnded : null)}
            >
                <For each={props.sourcesList}>{(source) => source}</For>
            </video>
        </a>
    );
}

interface CameraProps {
    id: string;
    sourcesList: HTMLSourceElement[];
    source: Accessor<HTMLSourceElement | undefined>;
    isActive: boolean;
    onClick: () => void;
    class: string;
}
