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
    isPlaying: {
        get: Accessor<boolean>;
        set: Setter<boolean>;
    };
    currentTime: {
        get: Accessor<number>;
        set: Setter<number>;
    };
    changeCurrentTime: {
        get: Accessor<number | null>;
        set: Setter<number | null>;
    };
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
    const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

    const [changeCurrentTime, setChangeCurrentTime] = createSignal<
        number | null
    >(null);

    const [currentTime, setCurrentTime] = createSignal<number>(0);
    const [playbackRate, setPlaybackRate] = createSignal<number>(1);

    createEffect(() => {
        // on select occurence auto play the video
        setIsPlaying(true);

        const _selectedOccurence = app.selectedOccurrence.get();
        if (!_selectedOccurence) {
            return;
        }

        videosPerTime = _selectedOccurence.videosPerTime;

        const playerStartPoint = _selectedOccurence.playerStartPoint;
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

        const _selectedOccurence = app.selectedOccurrence.get();
        if (!_selectedOccurence || !_selectedOccurence.videosPerTime) {
            return null;
        }

        const _videosPerTime = _selectedOccurence.videosPerTime;

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
        isPlaying: {
            get: isPlaying,
            set: setIsPlaying,
        },
        currentTime: {
            get: currentTime,
            set: setCurrentTime,
        },
        changeCurrentTime: {
            get: changeCurrentTime,
            set: setChangeCurrentTime,
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
