import {
    Accessor,
    JSXElement,
    Setter,
    createContext,
    createEffect,
    createMemo,
    createSignal,
    useContext,
} from "solid-js";
import { TimestampVideo } from "../interfaces";
import { useApp } from "./app.context";

export interface MainViewContextInterface {
    selectedVideos: Accessor<TimestampVideo | null>;
    startAt: {
        get: Accessor<number>;
        set: Setter<number>;
    };
    currentTime: {
        get: Accessor<number>;
        set: Setter<number>;
    };
    changeCurrentTime: {
        get: Accessor<number | null>;
        set: Setter<number | null>;
    };
    playbackRate: {
        get: Accessor<number>;
        set: Setter<number>;
    };
    endVideoEvent: () => void;
    ontimeupdate: (element: HTMLVideoElement) => () => void;
    ontimeupdateEvent: (element: HTMLVideoElement) => void;
}

const MainViewContext = createContext<MainViewContextInterface>();

export interface MainViewProviderInterface {
    children: JSXElement;
}

export const MainViewProvider = (props: MainViewProviderInterface) => {
    const app = useApp();

    if (!app) {
        return;
    }

    let videosPerTime: Record<number, TimestampVideo> | undefined;
    let videoKey = 0;

    const [selectedTimestampIndex, setSelectedTimestampIndex] = createSignal<
        number[] | null
    >(null);

    const [startAt, setStartAt] = createSignal<number>(0);

    const [changeCurrentTime, setChangeCurrentTime] = createSignal<
        number | null
    >(null);

    const [currentTime, setCurrentTime] = createSignal<number>(0);
    const [playbackRate, setPlaybackRate] = createSignal<number>(1);

    createEffect(() => {
        // on select occurrence auto play the video
        app.isPlaying.set(true);

        const _selectedOccurrence = app.selectedOccurrence.get();
        if (!_selectedOccurrence) {
            return;
        }

        videosPerTime = _selectedOccurrence.videosPerTime;

        const playerStartPoint = _selectedOccurrence.playerStartPoint;
        const videoStartIndex = playerStartPoint.index;
        const videoStartTime = playerStartPoint.videoStartAt;
        videoKey = playerStartPoint.key;

        setSelectedTimestampIndex([videoStartIndex, videoStartTime]);
    });

    const selectedVideos = createMemo<TimestampVideo | null>(() => {
        const _selectedTimestampIndex = selectedTimestampIndex();

        if (
            !_selectedTimestampIndex ||
            !Array.isArray(_selectedTimestampIndex) ||
            _selectedTimestampIndex.length === 0
        ) {
            return null;
        }

        const [index, time = 0] = _selectedTimestampIndex;
        setStartAt(time);

        const _selectedOccurrence = app.selectedOccurrence.get();
        if (!_selectedOccurrence || !_selectedOccurrence.videosPerTime) {
            return null;
        }

        const _videosPerTime = _selectedOccurrence.videosPerTime;

        const _videosKeys = Object.keys(_videosPerTime);
        if (_videosKeys.length === 0) {
            return null;
        }

        videoKey = Number(_videosKeys[index]);
        return _videosPerTime[videoKey];
    });

    createEffect(() => {
        const _changeCurrentTime = changeCurrentTime();
        if (_changeCurrentTime == null) {
            return;
        }

        if (!videosPerTime) {
            return;
        }

        const { index, startAt } = getVideosPerTimeIndex(
            videosPerTime,
            _changeCurrentTime
        );

        setSelectedTimestampIndex([index, startAt]);
    });

    createEffect(() => {
        const _changeCurrentTime = changeCurrentTime();
        if (_changeCurrentTime == null) {
            return;
        }

        if (!videosPerTime) {
            return;
        }

        const { index, startAt } = getVideosPerTimeIndex(
            videosPerTime,
            _changeCurrentTime
        );

        setSelectedTimestampIndex([index, startAt]);
    });

    const mainView: MainViewContextInterface = {
        selectedVideos: selectedVideos,
        startAt: {
            get: startAt,
            set: setStartAt,
        },
        currentTime: {
            get: currentTime,
            set: setCurrentTime,
        },
        changeCurrentTime: {
            get: changeCurrentTime,
            set: setChangeCurrentTime,
        },
        playbackRate: {
            get: playbackRate,
            set: setPlaybackRate,
        },
        endVideoEvent: () => {
            setSelectedTimestampIndex((timestamp) => {
                if (timestamp === null) {
                    return null;
                }

                return [(timestamp[0] += 1), 0];
            });
        },
        ontimeupdate: (element: HTMLVideoElement) => {
            return () => {
                setCurrentTime(videoKey + element.currentTime);
            };
        },
        ontimeupdateEvent: (element: HTMLVideoElement) => {
            setCurrentTime(videoKey + element.currentTime);
        },
    };

    return (
        <MainViewContext.Provider value={mainView}>
            {props.children}
        </MainViewContext.Provider>
    );

    function getVideosPerTimeIndex(
        timestampVideo: Record<number, TimestampVideo>,
        time: number
    ): { index: number; keyStamp: number; startAt: number } {
        let index = 0;
        let keyStamp = 0;
        let startAt = time;

        const keys = Object.keys(timestampVideo);

        for (const [i, value] of keys.entries()) {
            if (time >= Number(value)) {
                index = i;
                keyStamp = Number(value);
                startAt = time - Number(value);
                continue;
            }

            if (time < Number(value)) {
                break;
            }
        }

        return { index, keyStamp, startAt };
    }
};

export const useMainView = (): MainViewContextInterface | undefined => {
    return useContext<MainViewContextInterface | undefined>(MainViewContext);
};
