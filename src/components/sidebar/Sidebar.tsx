import { For } from "solid-js";
import { Occurence } from "../../models";
import { isSidebarOpen, occurences, setSelectedOccurence } from "../../stores";
import SidebarFooter from "./Footer";
import SidebarHeader from "./Header";
import styles from "./Sidebar.module.css";

export function Sidebar(props: {class: string}) {
  function getOccurrenceDateTime(occurence: Occurence) {
    return occurence.getConfig()?.getDateTime()?.toLocaleString() || "";
  }

  function getOccurrenceLocation(occurence: Occurence) {
    return occurence.getConfig()?.getCity() || "";
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
        <For each={occurences()}>
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
              onClick={() => setSelectedOccurence(occurence)}
            >
              <img
                class={["rounded-md", styles.thumbnail].join(" ")}
                src={occurence.getThumbnail() || ""}
              />
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
                  {getOccurrenceLocation(occurence)}
                </span>
                <span
                  class={[
                    "dark:text-gray-400 text-gray-600",
                    "overflow-hidden whitespace-nowrap text-ellipsis",
                  ].join(" ")}
                >
                  {getOccurrenceDateTime(occurence)}
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
