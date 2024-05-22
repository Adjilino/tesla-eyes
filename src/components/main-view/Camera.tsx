import { Accessor, Component, createEffect } from "solid-js";
import { useApp, useMainView } from "../../contexts";

export const Camera: Component<CameraProps> = (props: CameraProps) => {
    const app = useApp();
    const mainView = useMainView();

    if (!app || !mainView) {
        return;
    }

    let isEnded = false;
    let lastStartAt: number | null = null;

    createEffect(() => {
        const source = props.source();
        const _startAt = mainView.startAt.get();

        const videoElement = document.getElementById(
            props.id
        ) as HTMLVideoElement;

        if (source && videoElement.src !== source) {
            videoElement.onloadedmetadata = () => {
                videoElement.currentTime = _startAt;
                videoElement.onloadedmetadata = null;
            };
            lastStartAt = _startAt;
            videoElement.src = source;
        } else if (_startAt !== lastStartAt) {
            videoElement.currentTime = _startAt;
            lastStartAt = _startAt;
        }

        if (source && isEnded) {
            isEnded = false;
            app.isPlaying.set(true);
        }
    });

    createEffect(() => {
        const _isPlaying = app.isPlaying.get();

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
        const _playbackRate = mainView.playbackRate.get();

        const videoElement = document.getElementById(
            props.id
        ) as HTMLVideoElement;

        if (!videoElement) {
            return;
        }

        videoElement.defaultPlaybackRate = _playbackRate;
        videoElement.playbackRate = _playbackRate;
    });

    // const handlePause = () => {
    //   if (isPlaying()) {
    //     setIsPlaying(false);
    //   }
    // };

    // const handlePlay = () => {
    //   if (!isPlaying()) {
    //     setIsPlaying(true);
    //   }
    // };

    const handleEnded = () => {
        isEnded = true;

        mainView.endVideoEvent();
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
                muted={props.id === "frontElement" ? false : true}
                playsinline
                autoplay
                onTimeUpdate={(event) => {
                    if (props.id === "frontElement") {
                        mainView.ontimeupdateEvent(
                            event.target as HTMLVideoElement
                        );
                    }
                }}
                // onPlay={handlePlay}
                // onPause={handlePause}
                onEnded={() => (props.id ? handleEnded() : null)}
            />
        </a>
    );
};

interface CameraProps {
    id: string;
    source: Accessor<string | undefined>;
    isActive: boolean;
    onClick: () => void;
    class: string;
}
