import { Accessor, Setter } from "solid-js";
import styles from "./Sidebar.module.css";

function Sidebar(props: {
  isSidebarOpen: Accessor<boolean>;
  setisSidebarOpen: Setter<boolean>;
}) {
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
      <div class={"h-8 p-2 w-full flex items-center gap-2"}>
        <button onClick={() => props.setisSidebarOpen((o) => !o)}>close</button>
        <h1>Sidebar</h1>
      </div>
      <div class={"flex-grow p-2 w-full flex overflow-y-auto"}>
        content
      </div>
      <div class={"h-8 p-2 w-full flex items-center gap-2"}>footer</div>
    </div>
  );
}

export default Sidebar;
