import { createMemo, createSignal } from "solid-js";
import { selectedOccurrence, selectedVideos } from "../../stores";
import { Camera } from "./Camera";
import { Timeline } from "./Timelime";

interface SourcesList {
    front: HTMLSourceElement[];
    back: HTMLSourceElement[];
    left_repeater: HTMLSourceElement[];
    right_repeater: HTMLSourceElement[];
}

export function MainView() {
    const [selectedCamera, setSelectedCamera] = createSignal("front");

    const sourcesList = createMemo(() => {
        let _sourcesList: SourcesList = {
            front: [],
            back: [],
            left_repeater: [],
            right_repeater: [],
        };
        const _selectedOccurrence = selectedOccurrence();

        if (!_selectedOccurrence || !_selectedOccurrence.videosPerTime) {
            return _sourcesList;
        }

        _sourcesList = Object.values(_selectedOccurrence.videosPerTime).reduce(
            (acc, video) => {
                for (const camera of Object.keys(video)) {
                    acc[camera].push(video[camera]);
                }

                return acc;
            },
            _sourcesList
        );

        return _sourcesList;
    });

    const frontSource = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.front;
    });

    const backSource = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.back;
    });

    const leftSource = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.left_repeater;
    });

    const rightSource = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.right_repeater;
    });

    const selectCamera = (camera: string) => {
        setSelectedCamera(camera);
    };

    return (
        <>
            <div class="flex w-full h-full flex-col">
                <div class="flex-grow flex overflow-hidden relative">
                    <Camera
                        id="frontElement"
                        sourcesList={sourcesList().front}
                        source={frontSource}
                        isActive={selectedCamera() === "front"}
                        onClick={() => selectCamera("front")}
                        class="top-2 left-2"
                    />

                    <Camera
                        id="backElement"
                        sourcesList={sourcesList().back}
                        source={backSource}
                        isActive={selectedCamera() === "back"}
                        onClick={() => selectCamera("back")}
                        class="top-2 right-2"
                    />

                    <Camera
                        id="leftRepeaterElement"
                        sourcesList={sourcesList().left_repeater}
                        source={leftSource}
                        isActive={selectedCamera() === "left_repeater"}
                        onClick={() => selectCamera("left_repeater")}
                        class="bottom-2 left-2"
                    />

                    <Camera
                        id="rightRepeaterElement"
                        sourcesList={sourcesList().right_repeater}
                        source={rightSource}
                        isActive={selectedCamera() === "right_repeater"}
                        onClick={() => selectCamera("right_repeater")}
                        class="bottom-2 right-2"
                    />
                </div>
                <div class="flex">
                    <Timeline />
                </div>
            </div>
        </>
    );
}

export default MainView;
