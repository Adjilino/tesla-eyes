import { Accessor, For, Setter } from "solid-js";
import { Occurence } from "../../models";
import { occurences, setSelectedOccurence } from "../../stores";
import SidebarFooter from "./Footer";
import SidebarHeader from "./Header";
import styles from "./Sidebar.module.css";

export function Sidebar(props: {
  isSidebarOpen: Accessor<boolean>;
  setisSidebarOpen: Setter<boolean>;
}) {
  function getOccurrenceDateTime(occurence: Occurence) {
    return occurence.getConfig()?.getDateTime()?.toLocaleString() || "";
  }

  function getOccurrenceLocation(occurence: Occurence) {
    return occurence.getConfig()?.getCity() || "";
  }

  return (
    <div
      class={[
        "bg-slate-50 dark:bg-slate-900",
        "absolute top-0 left-0",
        "flex flex-col",
        "rounded-md shadow-lg h-screen overflow-x-hidden",
        styles.sidebarWidth,
      ].join(" ")}
      classList={{
        [styles.sidebarOpen]: props.isSidebarOpen(),
        [styles.sidebarClosed]: !props.isSidebarOpen(),
      }}
    >
      <div class={"h-16 p-2 flex items-center gap-2 " + styles.sidebarWidth}>
        <SidebarHeader
          isSidebarOpen={props.isSidebarOpen}
          setisSidebarOpen={props.setisSidebarOpen}
        />
      </div>
      <div
        class={
          "flex-grow flex-col gap-2 p-2 flex overflow-y-auto " +
          styles.sidebarWidth
        }
      >
        <For each={occurences()}>
          {(occurence) => (
            <button
              class={[
                "bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:bg-gray-200 dark:focus:bg-gray-600 focus:outline-none",
                "active:bg-gray-300 dark:active:bg-gray-500",
                "flex gap-2 rounded-md shadow-md p-2 w-full h-24",
              ].join(" ")}
              onClick={() => setSelectedOccurence(occurence)}
            >
              <img
                class={["rounded-md max-h-full", styles.thumbnail].join(" ")}
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
                <span class="dark:text-gray-400 text-gray-600">
                  {getOccurrenceDateTime(occurence)}
                </span>
              </div>
            </button>
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
