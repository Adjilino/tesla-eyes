import { AddFolderButton } from "../add-folder-button";

export function SidebarFooter() {
    return (
        <div class="flex w-full align-middle justify-between truncate">
            <div>
                <AddFolderButton />
            </div>
        </div>
    );
}

export default SidebarFooter;
