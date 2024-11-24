import { Component, createMemo, Show } from "solid-js";
import Button from "../../ui/Button";
import { useApp } from "../../contexts";

export const Navbar: Component = () => {
    const app = useApp();

    const toggleSidebar = () => {
        if (app) {
            app.sidebar.setIsOpen((o) => !o);
        }
    };

    const dateTitle = createMemo(() => {
        const _selectedOccurrence = app && app.selectedOccurrence.get();
        if (_selectedOccurrence && _selectedOccurrence?.getDateTime()) {
            return (
                _selectedOccurrence?.getDateTime()?.toDateString() +
                ", " +
                _selectedOccurrence?.getDateTime()?.toLocaleTimeString()
            );
        }

        return "";
    });

    // const coordinates = createMemo(() => {
    //     const _selectedOccurrence = app && app.selectedOccurrence.get();
    //     if (_selectedOccurrence && _selectedOccurrence.getConfig()) {
    //         return (
    //             _selectedOccurrence.getConfig()?.getEstLat() +
    //             "," +
    //             _selectedOccurrence.getConfig()?.getEstLon()
    //         );
    //     }

    //     return "";
    // });

    const city = createMemo(() => {
        const _selectedOccurrence = app && app.selectedOccurrence.get();
        if (_selectedOccurrence && _selectedOccurrence.getConfig()) {
            return _selectedOccurrence.getConfig()?.getCity() || "";
        }

        return "";
    });

    return (
        <Show when={app}>
            <div class="h-16 p-2 flex w-full items-center gap-2">
                <Button
                    onClick={toggleSidebar}
                    class="bg-transparent dark:bg-transparent"
                >
                    <i class="mx-2 fa-solid fa-fw fa-bars" />
                </Button>
                <div class="flex">
                    <div>Tesla eyes</div>
                </div>
                <div class="flex-grow flex justify-center">{dateTitle()}</div>
                {/* Coordinates is the city coordinates
                <Show when={coordinates()}>
                    <div class="flex justify-center">
                        <a
                            href={
                                "https://www.google.com/maps/search/?api=1&query=" +
                                coordinates()
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="mx-2 fa-solid fa-fw fa-map-location-dot" />
                            </a>
                            </div>
                            </Show> */}
                <Show when={city()}>
                    <div class="flex justify-center">
                        <a
                            href={
                                "https://www.google.com/maps/search/?api=1&query=" +
                                city()
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="mx-2 fa-solid fa-fw fa-map" />
                            {/* <i class="mx-2 fa-solid fa-fw fa-city" /> */}
                        </a>
                    </div>
                </Show>
            </div>
        </Show>
    );
};

export default Navbar;
