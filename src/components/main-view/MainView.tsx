import { createEffect, createSignal } from "solid-js";
import { selectedVideos, setIsPlaying } from "../../stores";
import { Camera } from "./Camera";
import { Timeline } from "./Timelime";

export function MainView() {
  const [selectedCamera, setSelectedCamera] = createSignal("front");

  createEffect(() => {
    const _selectedTimestampVideo = selectedVideos();
    if (!_selectedTimestampVideo) {
      return;
    }

    setVideo("frontElement", _selectedTimestampVideo.front);
    setVideo("backElement", _selectedTimestampVideo.back);
    setVideo("leftRepeaterElement", _selectedTimestampVideo.left_repeater);
    setVideo("rightRepeaterElement", _selectedTimestampVideo.right_repeater);
    setIsPlaying(true);
  });

  const setVideo = (
    element: string,
    video?: HTMLVideoElement,
    isPLaying = true
  ) => {
    const positionElement = document.getElementById(element);

    if (!positionElement) {
      return;
    }

    // Remove all children
    for (let i = 0; i < positionElement.children.length; i++) {
      positionElement.removeChild(positionElement.children[i]);
    }

    if (!video) {
      return;
    }

    positionElement?.appendChild(video);

    if (video.error) {
      const divWarning = createWarning();
      positionElement?.appendChild(divWarning);
    } else {
      video.onerror = () => {
        console.error(
          `Error with the video`,
          `At ${video.currentTime} seconds`,
          `This error is probably due to a corrupted video file.`
        );

        const divWarning = createWarning();
        positionElement?.appendChild(divWarning);
      };
    }

    if (isPLaying) {
      video.play();
    }
  };

  const createWarning = () => {
    const divWarning = document.createElement("div.warning");
    divWarning.style.position = "absolute";
    divWarning.style.top = "2px";
    divWarning.style.left = "2px";
    divWarning.style.color = "yellow";
    divWarning.title = "This video is corrupted";
    divWarning.innerHTML = "&#9888;";

    return divWarning;
  }

  const selectCamera = (camera: string) => {
    setSelectedCamera(camera);
  };

  return (
    <>
      <div class="flex w-full h-full flex-col">
        <div class="flex-grow flex overflow-hidden relative">
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
        <div class="flex">
          <Timeline />
        </div>
      </div>
    </>
  );
}

export default MainView;
