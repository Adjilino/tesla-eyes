import { createSignal } from "solid-js";

export const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

export enum Filter {
    All = "all",
    Sentry = "sentry",
    Dashcam = "dashcam",
}

export const [currentFilter, setCurrentFilter] = createSignal<string>(Filter.All);
