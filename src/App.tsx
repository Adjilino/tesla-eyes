import { Component, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";

const App: Component = () => {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

  return (
    <div
      class={
        "bg-white dark:bg-slate-800 text-gray-900 dark:text-white " +
        "h-screen w-full relative flex flex-col"
      }
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setisSidebarOpen={setIsSidebarOpen}
      />
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />

      <div class="flex-grow">
        <img src={logo} class="h-12 w-12" alt="logo" />
      </div>
    </div>
  );
};

export default App;
