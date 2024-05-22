import {
    Accessor,
    JSXElement,
    Setter,
    createContext,
    createEffect,
    createSignal,
    useContext,
} from "solid-js";
import { Occurrence, OccurrenceFiles } from "../models";

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
    selectedOccurrence: {
        get: Accessor<Occurrence | null>;
        set: Setter<Occurrence | null>;
        isLoading: Accessor<boolean>;
        setIsLoading: Setter<boolean>;
    };
    isPlaying: {
        get: Accessor<boolean>;
        set: Setter<boolean>;
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

    const [isLoadingSelectedOccurrence, setIsLoadingSelectedOccurrence] =
        createSignal<boolean>(false);

    const [selectedOccurrence, setSelectedOccurrence] =
        createSignal<Occurrence | null>(null);

    const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

    createEffect(() => {
        const _selectedOccurrenceFiles = selectedOccurrenceFiles();

        if (!_selectedOccurrenceFiles) {
            return;
        }

        setSelectedOccurrence(null);
        setIsLoadingSelectedOccurrence(true);
        setIsPlaying(false);
        setIsSidebarOpen(false);

        _selectedOccurrenceFiles
            .toOccurrence()
            .then((occurrence) => {
                setIsLoadingSelectedOccurrence(false);

                if (!occurrence) {
                    console.error(
                        "Failed to convert OccurenceFiles to Occurence",
                    );
                    alert("Failed to convert OccurenceFiles to Occurence");
                    return;
                }

                setSelectedOccurrence(occurrence);
            })
            .catch((error) => {
                setIsLoadingSelectedOccurrence(false);
                console.error(
                    "Error converting occurrenceFiles to Occurrence",
                    error,
                );
                alert("Error converting preloading occurrence");
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
            setSelected: setSelectedOccurrenceFiles
        },
        selectedOccurrence: {
            get: selectedOccurrence,
            set: setSelectedOccurrence,
            isLoading: isLoadingSelectedOccurrence,
            setIsLoading: setIsLoadingSelectedOccurrence,
        },
        isPlaying: {
            get: isPlaying,
            set: setIsPlaying,
        },
    };

    return (
        <AppContext.Provider value={app}>{props.children}</AppContext.Provider>
    );
};

export const useApp = (): AppContextInterface | undefined => {
    return useContext<AppContextInterface | undefined>(AppContext);
};
