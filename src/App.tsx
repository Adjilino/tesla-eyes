import { invoke } from "@tauri-apps/api";
import { Component, Show } from "solid-js";

import { MainView, Navbar, Sidebar } from "./components";
import NoOccurenceSelect from "./components/main-view/NoOccurenceSelect";
import { AppProvider, useApp } from "./contexts";
import { selectedOccurrence } from "./stores";

const App: Component = () => {
    const app = useApp();

    invoke("is_desktop").then((response) => {
        if (app) {
            app.platform.setIsDesktop(!!response);
        }
    });

    return (
        <AppProvider>
            <div
                class={
                    "bg-white dark:bg-slate-800 text-gray-900 dark:text-white " +
                    "h-[calc(100dvh)] w-full relative flex flex-col"
                }
            >
                <Sidebar class="z-30" />
                <Navbar />

                <div class="flex-grow flex overflow-hidden justify-center items-center">
                    <Show
                        when={!!selectedOccurrence()}
                        fallback={<NoOccurenceSelect />}
                    >
                        <MainView />
                    </Show>
                </div>
            </div>
        </AppProvider>
    );
};

export default App;
