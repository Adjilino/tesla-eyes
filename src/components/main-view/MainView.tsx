import { createEffect, createSignal } from "solid-js";
import { selectedTimestampVideo } from "../../stores";
import { Camera } from "./Camera";

export function MainView() {
  const [selectedCamera, setSelectedCamera] = createSignal("front");

  createEffect(() => {
    const _selectedTimestampVideo = selectedTimestampVideo();

    if (!_selectedTimestampVideo) {
      return;
    }

    setVideo("frontElement", _selectedTimestampVideo.front);
    setVideo("backElement", _selectedTimestampVideo.back);
    setVideo("leftRepeaterElement", _selectedTimestampVideo.left_repeater);
    setVideo("rightRepeaterElement", _selectedTimestampVideo.right_repeater);
  });

  const setVideo = (element: string, video?: HTMLVideoElement) => {
    if (!video) {
      return;
    }

    const positionElement = document.getElementById(element);

    if (!positionElement) {
      return;
    }

    positionElement.children.length &&
      positionElement.removeChild(positionElement.children[0]);
    positionElement?.appendChild(video);

    video.play();
  };

  const selectCamera = (camera: string) => {
    setSelectedCamera(camera);
  };

  return (
    <div class="flex relative w-full h-full">
      <Camera
        id="frontElement"
        isActive={selectedCamera() === "front"}
        onClick={() => selectCamera("front")}
        class="top-2 left-2"
      />

      <Camera
        id="backElement"
        isActive={selectedCamera() === "back"}
        onClick={() => selectCamera("back")}
        class="top-2 right-2"
      />

      <Camera
        id="leftRepeaterElement"
        isActive={selectedCamera() === "left_repeater"}
        onClick={() => selectCamera("left_repeater")}
        class="bottom-2 left-2"
      />

      <Camera
        id="rightRepeaterElement"
        isActive={selectedCamera() === "right_repeater"}
        onClick={() => selectCamera("right_repeater")}
        class="bottom-2 right-2"
      />
    </div>
  );
}

export default MainView;
