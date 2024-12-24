import { invoke } from "@tauri-apps/api/core";
import { Component, Show } from "solid-js";

import { MainView, Navbar, Sidebar } from "./components";
import NoOccurrenceSelect from "./components/main-view/NoOccurenceSelect";
import { MainViewProvider, useApp } from "./contexts";

const App: Component = () => {
    const app = useApp();

    invoke("is_desktop").then((response) => {
        if (app) {
            app.platform.setIsDesktop(!!response);
        }
    });

    return (
        <Show when={app}>
            <MainViewProvider>
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
                            when={app && !!app.selectedOccurrence.get()}
                            fallback={<NoOccurrenceSelect />}
                        >
                            <MainView />
                        </Show>
                    </div>
                </div>
            </MainViewProvider>
        </Show>
    );
};

export default App;
