import { createMemo, createSignal } from "solid-js";
import { selectedVideos } from "../../stores";
import { Camera } from "./Camera";
import { Timeline } from "./Timelime";

export function MainView() {
  const [selectedCamera, setSelectedCamera] = createSignal("front");

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
            source={frontSource}
            isActive={selectedCamera() === "front"}
            onClick={() => selectCamera("front")}
            class="top-2 left-2"
          />

          <Camera
            id="backElement"
            source={backSource}
            isActive={selectedCamera() === "back"}
            onClick={() => selectCamera("back")}
            class="top-2 right-2"
          />

          <Camera
            id="leftRepeaterElement"
            source={leftSource}
            isActive={selectedCamera() === "left_repeater"}
            onClick={() => selectCamera("left_repeater")}
            class="bottom-2 left-2"
          />

          <Camera
            id="rightRepeaterElement"
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
