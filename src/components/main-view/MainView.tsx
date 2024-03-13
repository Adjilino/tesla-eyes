import { createMemo, createSignal } from "solid-js";
import { ontimeupdateEvent, selectedVideos } from "../../stores";
import { Camera } from "./Camera";
import { Timeline } from "./Timelime";

export function MainView() {
    const [selectedCamera, setSelectedCamera] = createSignal("front");

    const frontSourceString = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.front;
    });

    const backSourceString = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.back;
    });

    const leftSourceString = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.left_repeater;
    });

    const rightSourceString = createMemo(() => {
        const _selectedTimestampVideo = selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.right_repeater;
    });

    const getUpdateTime = (id: string) => {
        if (frontSourceString()) {
            if (id == "front") {
                return ontimeupdateEvent;
            }
        } else if (backSourceString()) {
            if (id == "back") {
                return ontimeupdateEvent;
            }
        } else if (leftSourceString()) {
            if (id == "left") {
                return ontimeupdateEvent;
            }
        } else if (rightSourceString()) {
            if ((id == "right")) {
                return ontimeupdateEvent;
            }
        }

        return;
    };

    const selectCamera = (camera: string) => {
        setSelectedCamera(camera);
    };

    return (
        <>
            <div class="flex w-full h-full flex-col">
                <div class="flex-grow flex overflow-hidden relative">
                    <Camera
                        id="frontElement"
                        source={frontSourceString}
                        isActive={selectedCamera() === "front"}
                        onClick={() => selectCamera("front")}
                        class="top-2 left-2"
                        onTimeUpdate={getUpdateTime("front")}
                    />

                    <Camera
                        id="backElement"
                        source={backSourceString}
                        isActive={selectedCamera() === "back"}
                        onClick={() => selectCamera("back")}
                        class="top-2 right-2"
                        onTimeUpdate={getUpdateTime("back")}
                    />

                    <Camera
                        id="leftRepeaterElement"
                        source={leftSourceString}
                        isActive={selectedCamera() === "left_repeater"}
                        onClick={() => selectCamera("left_repeater")}
                        class="bottom-2 left-2"
                        onTimeUpdate={getUpdateTime("left")}
                    />

                    <Camera
                        id="rightRepeaterElement"
                        source={rightSourceString}
                        isActive={selectedCamera() === "right_repeater"}
                        onClick={() => selectCamera("right_repeater")}
                        class="bottom-2 right-2"
                        onTimeUpdate={getUpdateTime("right")}
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
