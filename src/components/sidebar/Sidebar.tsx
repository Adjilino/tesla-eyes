import { Accessor, For, Setter } from "solid-js";
import { Occurence } from "../../models";
import { occurences } from "../../stores";
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
            <div
              class={[
                "bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
                "flex gap-2 rounded-md shadow-md p-2 w-full h-24",
              ].join(" ")}
            >
              <div class="flex">
                <img
                  class={["rounded-md", styles.thumbnail].join(" ")}
                  src={occurence.getThumbnail() || ""}
                />
              </div>
              <div class="flex-grow flex flex-col overflow-hidden">
                <span class="text-ellipsis">
                  {getOccurrenceDateTime(occurence)}
                </span>
                <span class="text-ellipsis">
                  {getOccurrenceLocation(occurence)}
                </span>
              </div>
            </div>
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
