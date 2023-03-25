import { createEffect, createSignal } from "solid-js";
import { selectedTimestampVideo } from "../../stores";

export function MainView() {
  const cameraClasses =
    "absolute z-10 w-32 h-24 rounded-lg overflow-hidden shadow cursor-pointer";
  const activeCameraClasses = "flex max-w-full max-h-full";
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

    frontVideoElement && setVideo("frontElement", frontVideoElement);

    backVideoElement && setVideo("backElement", backVideoElement);

    leftRepeaterVideoElement &&
      setVideo("leftRepeaterElement", leftRepeaterVideoElement);

    rightRepeaterVideoElement &&
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

    if (element === "frontElement") {
      addVideoEvent(video);
    }

    video.play();
  };

  const addVideoEvent = (videoElement: HTMLVideoElement) => {
    videoElement.onended = () => {
      console.log("ended");
    };

    videoElement.ontimeupdate = () => {
      console.log("timeupdate");
    }
  }

  const removeVideoEvent = (videoElement: HTMLVideoElement) => {    
    videoElement.onended = null;
    videoElement.ontimeupdate = null;

    videoElement.pause();
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
          selectedCamera() === "front"
            ? activeCameraClasses
            : `${cameraClasses} top-2 left-2`,
        ].join(" ")}
        onClick={() => selectCamera("front")}
      />
      <a
        id="backElement"
        class={[
          "m-auto",
          selectedCamera() === "back"
            ? activeCameraClasses
            : `${cameraClasses} top-2 right-2`,
        ].join(" ")}
        onClick={() => selectCamera("back")}
      />
      <a
        id="leftRepeaterElement"
        class={[
          "m-auto",
          selectedCamera() === "left_repeater"
            ? activeCameraClasses
            : `${cameraClasses} bottom-2 left-2`,
        ].join(" ")}
        onClick={() => selectCamera("left_repeater")}
      />
      <a
        id="rightRepeaterElement"
        class={[
          "m-auto",
          selectedCamera() === "right_repeater"
            ? activeCameraClasses
            : `${cameraClasses} bottom-2 right-2`,
        ].join(" ")}
        onClick={() => selectCamera("right_repeater")}
      />
    </div>
  );
}

export default MainView;
