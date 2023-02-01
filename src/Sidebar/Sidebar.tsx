import { Accessor, Setter } from "solid-js";
import SidebarFooter from "./Footer";
import SidebarHeader from "./Header";
import styles from "./Sidebar.module.css";

function Sidebar(props: {
  isSidebarOpen: Accessor<boolean>;
  setisSidebarOpen: Setter<boolean>;
}) {
  // const [videos, setVideos] = createSignal<Video[]>([]);

  return (
    <div
      class={
        "bg-slate-50 dark:bg-slate-900 " +
        "absolute top-0 left-0 " +
        "flex flex-col " +
        "rounded-md shadow-lg h-screen overflow-x-hidden " +
        styles.sidebarWidth
      }
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
      <div class={"flex-grow p-2 flex overflow-y-auto " + styles.sidebarWidth}>
        content
      </div>
      <div class={"h-16 p-2 flex items-center gap-2 " + styles.sidebarWidth}>
        <SidebarFooter />
      </div>
    </div>
  );
}

export default Sidebar;
