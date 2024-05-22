import { Component } from "solid-js";
import { AddFolderButton } from "../add-folder-button";

export const SidebarFooter: Component = () => {
    return (
        <div class="flex w-full align-middle justify-between truncate">
            <div>
                <AddFolderButton />
            </div>
        </div>
    );
};

export default SidebarFooter;
