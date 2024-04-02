import {
    Accessor,
    JSXElement,
    Setter,
    createContext,
    createSignal,
    useContext,
} from "solid-js";

export interface AppContextInterface {
    platform: {
        isDesktop: Accessor<boolean>;
        setIsDesktop: Setter<boolean>;
    };
}

const AppContext = createContext<AppContextInterface>();

export interface AppProviderInterface {
    children: JSXElement;
}

export const AppProvider = (props: AppProviderInterface) => {
    const [isDesktop, setIsDesktop] = createSignal(false);

    const app: AppContextInterface = {
        platform: {
            isDesktop,
            setIsDesktop,
        },
    };

    return (
        <AppContext.Provider value={app}>{props.children}</AppContext.Provider>
    );
};

export const useApp = (): AppContextInterface | undefined => {
    return useContext<AppContextInterface | undefined>(AppContext);
};
