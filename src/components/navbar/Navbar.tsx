import { Component, createMemo } from "solid-js";
import { selectedOccurrence } from "../../stores";
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
        if (selectedOccurrence() && selectedOccurrence()?.getDateTime()) {
            return (
                selectedOccurrence()?.getDateTime()?.toDateString() +
                ", " +
                selectedOccurrence()?.getDateTime()?.toLocaleTimeString()
            );
        }

        return "";
    });

    return (
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
        </div>
    );
};

export default Navbar;
