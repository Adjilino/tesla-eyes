import { Component, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import Sidebar from "./Sidebar/Sidebar";

const App: Component = () => {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

  return (
    <div
      class={
        "bg-white dark:bg-slate-800 text-gray-900 dark:text-white " +
        "h-screen w-full relative flex flex-col items-center justify-center "
      }
    >
      <Sidebar isSidebarOpen={isSidebarOpen} setisSidebarOpen={setIsSidebarOpen} />

      <img src={logo} class="h-12 w-12" alt="logo" />
      <button onClick={() => setIsSidebarOpen((o) => !o)}>Open</button>
    </div>
  );
};

export default App;
