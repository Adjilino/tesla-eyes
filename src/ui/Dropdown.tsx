import { Component, For, createSignal } from "solid-js";
import { uuidV4 } from "../utils";
import Button from "./Button";

interface Option {
    label: string;
    value: string;
}

interface DropdownProps {
    value: string;
    placeholder?: string;
    options: Option[];
    class?: string;
    onSelect?: (value: Option) => void;
}

export const Dropdown: Component<DropdownProps> = (props: DropdownProps) => {
    const uuid = uuidV4();

    const [selected, setSelected] = createSignal<Option | undefined>(undefined);

    const onSelect = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const selectedOption = props.options.find(
            (option) => option.value === target.value
        );

        if (!selectedOption) {
            return;
        }

        setSelected(selectedOption);
        props.onSelect && props.onSelect(selectedOption);
    };

    return (
        <>
            <Button class={"relative w-14 " + props.class || ""}>
                {selected()?.label ||
                    props.value ||
                    props.placeholder ||
                    "Select"}
                <select
                    id={uuid}
                    class="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                    onChange={(e) => onSelect(e)}
                    value={props.value}
                >
                    <For each={props.options}>
                        {(option) => (
                            <option value={option.value}>{option.label}</option>
                        )}
                    </For>
                </select>
            </Button>
        </>
    );
};

export default Dropdown;
