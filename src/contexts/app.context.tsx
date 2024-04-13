import {
    Accessor,
    JSXElement,
    Setter,
    createContext,
    createEffect,
    createSignal,
    useContext,
} from "solid-js";
import { OccurrenceFiles } from "../models";
import {
    setIsLoadingSelectedOccurrence,
    setIsPlaying,
    setSelectedOccurrence,
} from "../stores";

export interface AppContextInterface {
    platform: {
        isDesktop: Accessor<boolean>;
        setIsDesktop: Setter<boolean>;
    };
    sidebar: {
        isOpen: Accessor<boolean>;
        setIsOpen: Setter<boolean>;
    };
    fileByOccurrence: {
        get: Accessor<OccurrenceFiles[]>;
        set: Setter<OccurrenceFiles[]>;
        getSelected: Accessor<OccurrenceFiles | null>;
        setSelected: Setter<OccurrenceFiles | null>;
    };
}

const AppContext = createContext<AppContextInterface>();

export interface AppProviderInterface {
    children: JSXElement;
}

export const AppProvider = (props: AppProviderInterface) => {
    const [isDesktop, setIsDesktop] = createSignal(false);
    const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

    const [fileByOccurrence, setFilesByOccurrences] = createSignal<
        Array<OccurrenceFiles>
    >([]);
    const [selectedOccurrenceFiles, setSelectedOccurrenceFiles] =
        createSignal<OccurrenceFiles | null>(null);

    createEffect(() => {
        const _selectedOccurrenceFiles = selectedOccurrenceFiles();

        if (!_selectedOccurrenceFiles) {
            return;
        }

        setSelectedOccurrence(null);
        setIsLoadingSelectedOccurrence(true);
        setIsPlaying(false);
        // TODO: close
        // setIsSidebarOpen(false);

        _selectedOccurrenceFiles
            .toOccurrence()
            .then((occurrence) => {
                if (!occurrence) {
                    console.error(
                        "Failed to convert OccurenceFiles to Occurence"
                    );
                    return;
                }

                setIsLoadingSelectedOccurrence(false);
                setSelectedOccurrence(occurrence);
            })
            .catch((error) => {
                setIsLoadingSelectedOccurrence(false);
                console.error(
                    "Error converting occurrenceFiles to Occurrence",
                    error
                );
            });
    });

    const app: AppContextInterface = {
        platform: {
            isDesktop,
            setIsDesktop,
        },
        sidebar: {
            isOpen: isSidebarOpen,
            setIsOpen: setIsSidebarOpen,
        },
        fileByOccurrence: {
            get: fileByOccurrence,
            set: setFilesByOccurrences,
            getSelected: selectedOccurrenceFiles,
            setSelected: setSelectedOccurrenceFiles,
        },
    };

    return (
        <AppContext.Provider value={app}>{props.children}</AppContext.Provider>
    );
};

export const useApp = (): AppContextInterface | undefined => {
    return useContext<AppContextInterface | undefined>(AppContext);
};
