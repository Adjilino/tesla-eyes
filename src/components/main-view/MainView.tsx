import { createEffect, createSignal } from "solid-js";
import { selectedTimestampVideo } from "../../stores";

export function MainView() {
  const cameraClasses = "absolute z-10 w-32 h-24 rounded-lg overflow-hidden shadow cursor-pointer";
  const [selectedCamera, setSelectedCamera] = createSignal("front");

  createEffect(() => {
    const _selectedTimestampVideo = selectedTimestampVideo();

    if (!_selectedTimestampVideo) {
      return;
    }

    const frontVideoElement = _selectedTimestampVideo.front;
    const backVideoElement = _selectedTimestampVideo.back;
    const leftRepeaterVideoElement = _selectedTimestampVideo.left_repeater;
    const rightRepeaterVideoElement = _selectedTimestampVideo.right_repeater;

    setVideo("frontElement", frontVideoElement);
    setVideo("backElement", backVideoElement);
    setVideo("leftRepeaterElement", leftRepeaterVideoElement);
    setVideo("rightRepeaterElement", rightRepeaterVideoElement);
  });

  const setVideo = (element: string, video: HTMLVideoElement) => {
    const positionElement = document.getElementById(element);

    if (!positionElement) {
      return;
    }

    positionElement.children.length &&
      positionElement.removeChild(positionElement.children[0]);
    positionElement?.appendChild(video);

    video.currentTime = 0;
    video.play();
  };

  const selectCamera = (camera: string) => {
    setSelectedCamera(camera);
  };

  return (
    <div class="flex relative w-full h-full">
      <a
        id="frontElement"
        class={[
          "m-auto",
          selectedCamera() === "front" ? "" : `${cameraClasses} top-2 left-2`,
        ].join(" ")}
        onClick={() => selectCamera("front")}
      />
      <a
        id="backElement"
        class={[
          "m-auto",
          selectedCamera() === "back" ? "" : `${cameraClasses} top-2 right-2`,
        ].join(" ")}
        onClick={() => selectCamera("back")}
      />
      <a
        id="leftRepeaterElement"
        class={[
          "m-auto",
          selectedCamera() === "left_repeater"
            ? ""
            : `${cameraClasses} bottom-2 left-2`,
        ].join(" ")}
        onClick={() => selectCamera("left_repeater")}
      />
      <a
        id="rightRepeaterElement"
        class={[
          "m-auto",
          selectedCamera() === "right_repeater"
            ? ""
            : `${cameraClasses} bottom-2 right-2`,
        ].join(" ")}
        onClick={() => selectCamera("right_repeater")}
      />
    </div>
  );
}

export default MainView;
