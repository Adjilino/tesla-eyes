import { createSignal } from "solid-js";

export enum Filter {
    All = "all",
    Sentry = "sentry",
    Dashcam = "dashcam",
}

export const [currentFilter, setCurrentFilter] = createSignal(Filter.All);
