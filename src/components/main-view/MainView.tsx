import { Component, createMemo, createSignal, Show } from "solid-js";
import { Camera } from "./Camera";
import { Timeline } from "./Timeline";
import { useApp, useMainView } from "../../contexts";

export const MainView: Component = () => {
    const app = useApp();

    const mainViewContext = useMainView();

    const [selectedCamera, setSelectedCamera] = createSignal("front");

    const frontSourceString = createMemo(() => {
        const _selectedTimestampVideo =
            mainViewContext && mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.front;
    });

    const backSourceString = createMemo(() => {
        const _selectedTimestampVideo =
            mainViewContext && mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.back;
    });

    const leftSourceString = createMemo(() => {
        const _selectedTimestampVideo =
            mainViewContext && mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.left_repeater;
    });

    const rightSourceString = createMemo(() => {
        const _selectedTimestampVideo =
            mainViewContext && mainViewContext.selectedVideos();
        if (!_selectedTimestampVideo) {
            return;
        }

        return _selectedTimestampVideo.right_repeater;
    });

    const selectCamera = (camera: string) => {
        setSelectedCamera(camera);
    };

    return (
        <Show when={app && mainViewContext}>
            <div class="flex w-full h-full flex-col">
                <div class="flex-grow flex overflow-hidden relative items-center justify-center">
                    <Camera
                        id="frontElement"
                        name="Front"
                        source={frontSourceString}
                        isActive={selectedCamera() === "front"}
                        onClick={() => selectCamera("front")}
                        class="top-2 left-2"
                    />

                    <Camera
                        id="backElement"
                        name="Back"
                        source={backSourceString}
                        isActive={selectedCamera() === "back"}
                        onClick={() => selectCamera("back")}
                        class="top-2 right-2"
                    />

                    <Camera
                        id="leftRepeaterElement"
                        name="left"
                        source={leftSourceString}
                        isActive={selectedCamera() === "left_repeater"}
                        onClick={() => selectCamera("left_repeater")}
                        class="bottom-2 left-2"
                    />

                    <Camera
                        id="rightRepeaterElement"
                        name="right"
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
        </Show>
    );
};

export default MainView;
