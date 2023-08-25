import { For, Show } from "solid-js";
import { OccurenceFiles } from "../../models/occurence-files";
import {
  fileByOccurence,
  isSidebarOpen,
  setIsPlaying,
  setIsSidebarOpen,
  setSelectedOccurence,
} from "../../stores";
import SidebarFooter from "./Footer";
import SidebarHeader from "./Header";
import styles from "./Sidebar.module.css";

export function Sidebar(props: { class: string }) {
  function getOccurrenceDateTime(occurenceFiles: OccurenceFiles) {
    return occurenceFiles.getConfig()?.getDateTime()?.toLocaleString() || "";
  }
  function getOccurrenceLocation(occurenceFiles: OccurenceFiles) {
    return occurenceFiles.getConfig()?.getCity() || "";
  }
  async function onClickOccurence(occurenceFiles: OccurenceFiles) {
    setIsPlaying(false);
    setIsSidebarOpen(false);

    try {
      const occurence = await occurenceFiles.toOccurence();

      if (!occurence) {
        console.error("Failed to convert OccurenceFiles to Occurence");
        return;
      }

      setSelectedOccurence(occurence);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  return (
    <div
      class={[
        props.class,
        "bg-slate-50 dark:bg-slate-900",
        "absolute top-0 left-0",
        "flex flex-col",
        "rounded-md shadow-lg h-screen overflow-x-hidden",
        styles.sidebarWidth,
      ].join(" ")}
      classList={{
        [styles.sidebarOpen]: isSidebarOpen(),
        [styles.sidebarClosed]: !isSidebarOpen(),
      }}
    >
      <div class={"h-16 p-2 flex items-center gap-2 " + styles.sidebarWidth}>
        <SidebarHeader />
      </div>
      <div
        class={
          "flex-grow flex-col gap-2 p-2 flex overflow-y-auto " +
          styles.sidebarWidth
        }
      >
        <For each={fileByOccurence()}>
          {(occurence) => (
            <a
              class={[
                "bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:bg-gray-200 dark:focus:bg-gray-600 focus:outline-none",
                "active:bg-gray-300 dark:active:bg-gray-500",
                "flex gap-2 rounded-md shadow-md p-2 w-full h-24",
                "cursor-pointer",
              ].join(" ")}
              onClick={() => onClickOccurence(occurence)}
            >
              <Show
                when={occurence.getThumbnail()}
                fallback={
                  <div
                    class={[
                      "flex items-center justify-center text-ellipsis italic",
                      styles.thumbnail,
                    ].join(" ")}
                  >
                    <i class="fa-solid fa-image" />
                  </div>
                }
              >
                <img
                  class={["rounded-md", styles.thumbnail].join(" ")}
                  src={occurence.getThumbnail() || ""}
                />
              </Show>
              <div
                class={[
                  "flex-grow flex flex-col overflow-hidden justify-center",
                  "text-sm text-left my-auto",
                ].join(" ")}
              >
                <span
                  class={[
                    "text-ellipsis overflow-hidden whitespace-nowrap",
                    "font-bold",
                  ].join(" ")}
                >
                  {getOccurrenceLocation(occurence) || "Unknown location"}
                </span>
                <span
                  class={[
                    "dark:text-gray-400 text-gray-600",
                    "overflow-hidden whitespace-nowrap text-ellipsis",
                  ].join(" ")}
                >
                  {getOccurrenceDateTime(occurence) || "Unknown date"}
                </span>
              </div>
            </a>
          )}
        </For>
      </div>
      <div class={"h-16 p-2 flex items-center gap-2 " + styles.sidebarWidth}>
        <SidebarFooter />
      </div>
    </div>
  );
}

export default Sidebar;
