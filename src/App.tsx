import { Component } from "solid-js";

import { MainView, Navbar, Sidebar } from "./components";

const App: Component = () => {
  return (
    <div
      class={
        "bg-white dark:bg-slate-800 text-gray-900 dark:text-white " +
        "h-screen w-full relative flex flex-col"
      }
    >
      <Sidebar class="z-30" />
      <Navbar />

      <div class="flex-grow overflow-hidden">
        <MainView />
      </div>
    </div>
  );
};

export default App;
