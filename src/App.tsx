import { invoke } from "@tauri-apps/api";
import { removeDir } from "@tauri-apps/api/fs";
import { Component, Show } from "solid-js";

import { MainView, Navbar, Sidebar } from "./components";
import NoOccurenceSelect from "./components/main-view/NoOccurenceSelect";
import { selectedOccurence, setIsDesktop } from "./stores";

const App: Component = () => {
  invoke('is_desktop').then((response) => {
    setIsDesktop(!!response);
  });

  return (
    <div
      class={
        "bg-white dark:bg-slate-800 text-gray-900 dark:text-white " +
        "h-screen w-full relative flex flex-col"
      }
    >
      <Sidebar class="z-30" />
      <Navbar />

      <div class="flex-grow flex overflow-hidden justify-center items-center">
        <Show when={!!selectedOccurence()} fallback={<NoOccurenceSelect />}>
          <MainView />
        </Show>
      </div>
    </div>
  );
};

export default App;
