import { For } from "solid-js";
import {
    Filter,
    currentFilter,
    setCurrentFilter,
    setIsSidebarOpen,
} from "../../stores";
import { Button } from "../../ui";

export function SidebarHeader() {
    function toggleSidebar() {
        setIsSidebarOpen((o) => !o);
    }

    return (
        <div class="flex w-full truncate">
            <div class="flex grow items-center">
                <Button onClick={toggleSidebar} class="bg-transparent dark:bg-transparent">
                    <i class="mx-2 fa-solid fa-fw fa-bars" />
                </Button>
            </div>

            <div class="flex grow items-center gap-3">
                <For each={Object.keys(Filter)}>
                    {(key) => (
                        <a
                            class={[
                                "hover:underline hover:cursor-pointer",
                                currentFilter() === Filter[key]
                                    ? "font-bold"
                                    : "",
                            ].join(" ")}
                            onClick={() => setCurrentFilter(Filter[key])}
                        >
                            {key}
                        </a>
                    )}
                </For>
            </div>

            <div class="flex items-center justify-items-center">
                <a
                    class="px-2 font-semibold hover:cursor-pointer hover:underline"
                    href="https://github.com/Adjilino/tesla-eyes/issues"
                    target="_blank"
                >
                    <i class="mr-2 fa-solid fa-fw fa-bug" />
                </a>
            </div>
        </div>
    );
}

export default SidebarHeader;
