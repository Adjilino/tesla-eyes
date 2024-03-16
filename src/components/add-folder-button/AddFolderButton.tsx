import { Show } from "solid-js";
import { isLoadingOccurrences, setIsSidebarOpen } from "../../stores";
import { Button } from "../../ui";
import { addFolder } from "../../utils";

export interface AddFolderButtonProps {
    triggerSideBar?: boolean;
}

export function AddFolderButton(props: AddFolderButtonProps) {
    const addFolderClick = () => {
        if (props.triggerSideBar) {
            setIsSidebarOpen(true);
        }

        addFolder();
    };

    return (
        <Button onClick={() => addFolderClick()}>
            <Show when={isLoadingOccurrences()}>
                <div class="inline mr-2">
                    <i class="fa-solid fa-video fa-beat-fade" />
                </div>
            </Show>
            <span class="truncate">Add folder</span>
        </Button>
    );
}
