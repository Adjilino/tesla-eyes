import {
    Accessor,
    Component,
    Show,
    createEffect,
    createSignal,
} from "solid-js";
import { useApp, useMainView } from "../../contexts";

export const Camera: Component<CameraProps> = (props: CameraProps) => {
    const app = useApp();
    const mainView = useMainView();

    if (!app || !mainView) {
        return;
    }

    let isEnded = false;
    let lastStartAt: number | null = null;

    const [hasError, setHasError] = createSignal(false);

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

            setHasError(false);
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

        if (hasError()) {
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
    //   if (app.isPlaying.get()) {
    //     app.isPlaying.set(false);
    //   }
    // };

    // const handlePlay = () => {
    //   if (!app.isPlaying.get()) {
    //     app.isPlaying.set(true);
    //   }
    // };

    const handleEnded = () => {
        isEnded = true;

        mainView.endVideoEvent();
    };

    return (
        <a
            class={[
                props.isActive
                    ? "flex flex-grow max-w-full max-h-full"
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
                onError={() => setHasError(true)}
            />
            <Show when={!props.isActive}>
                <div class="absolute bottom-0 pl-1">{props.name}</div>
            </Show>
            <Show when={hasError()}>
                <div class="absolute top-0 flex w-full h-full items-center justify-center">
                    <i class="fa-solid fa-triangle-exclamation text-amber-300 shadow-2xl shadow-amber-200" />
                </div>
            </Show>
        </a>
    );
};

interface CameraProps {
    id: string;
    name: string;
    source: Accessor<string | undefined>;
    isActive: boolean;
    onClick: () => void;
    class: string;
}
