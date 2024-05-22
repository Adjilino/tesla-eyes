import { Component, createMemo } from "solid-js";
import Button from "../../ui/Button";
import { useApp } from "../../contexts";

export const Navbar: Component = () => {
    const app = useApp();

    if (!app) {
        return;
    }

    const toggleSidebar = () => {
        if (app) {
            app.sidebar.setIsOpen((o) => !o);
        }

    };

    const dateTitle = createMemo(() => {
        const _selectedOccurrence = app.selectedOccurrence.get();
        if (_selectedOccurrence && _selectedOccurrence?.getDateTime()) {
            return (
                _selectedOccurrence?.getDateTime()?.toDateString() +
                ", " +
                _selectedOccurrence?.getDateTime()?.toLocaleTimeString()
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
