import { Component, Show } from "solid-js";

import { MainView, Navbar, Sidebar } from "./components";
import { selectedOccurence } from "./stores";
import NoOccurenceSelect from "./components/main-view/NoOccurenceSelect";

import { invoke } from "@tauri-apps/api";

const App: Component = () => {
  invoke('greet', {name: 'World'}).then((response) => {
    console.log(response);
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
