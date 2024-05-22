/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { AppProvider } from "./contexts";

render(
    () => (
        <AppProvider>
            <App />
        </AppProvider>
    ),
    document.getElementById("root") as HTMLElement
);
