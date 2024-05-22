import { Component, createEffect, createMemo, createSignal } from "solid-js";
import { Camera } from "./Camera";
import { Timeline } from "./Timelime";
import { MainViewProvider, useApp, useMainView } from "../../contexts";

export const MainView: Component = () => {
    const app = useApp();

    if (!app) {
        return;
    }

    const mainViewContext = useMainView();

    if (!mainViewContext) {
        return;
    }

    const [selectedCamera, setSelectedCamera] = createSignal("front");

    const frontSourceString = createMemo(() => {
        const _selectedTimestampVideo = mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.front;
    });

    const backSourceString = createMemo(() => {
        const _selectedTimestampVideo = mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.back;
    });

    const leftSourceString = createMemo(() => {
        const _selectedTimestampVideo = mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.left_repeater;
    });

    const rightSourceString = createMemo(() => {
        const _selectedTimestampVideo = mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.right_repeater;
    });

    const selectCamera = (camera: string) => {
        setSelectedCamera(camera);
    };

    return (
        <div class="flex w-full h-full flex-col">
            <div class="flex-grow flex overflow-hidden relative">
                <Camera
                    id="frontElement"
                    source={frontSourceString}
                    isActive={selectedCamera() === "front"}
                    onClick={() => selectCamera("front")}
                    class="top-2 left-2"
                />

                <Camera
                    id="backElement"
                    source={backSourceString}
                    isActive={selectedCamera() === "back"}
                    onClick={() => selectCamera("back")}
                    class="top-2 right-2"
                />

                <Camera
                    id="leftRepeaterElement"
                    source={leftSourceString}
                    isActive={selectedCamera() === "left_repeater"}
                    onClick={() => selectCamera("left_repeater")}
                    class="bottom-2 left-2"
                />

                <Camera
                    id="rightRepeaterElement"
                    source={rightSourceString}
                    isActive={selectedCamera() === "right_repeater"}
                    onClick={() => selectCamera("right_repeater")}
                    class="bottom-2 right-2"
                />
            </div>
            <div class="flex">
                <Timeline />
            </div>
        </div>
    );
};

export default MainView;
