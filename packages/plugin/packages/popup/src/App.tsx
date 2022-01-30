import React, { useEffect, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RecordPage from "./RecordPage";
import { BackgroundActionType, IPopupGetState, IPopupState } from "@syncroc/common";
import MainPage from "./MainPage";
import NotSupported from "./NotSupported";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0CCA4A",
            contrastText: "#FFFFFF"
        }
    }
});

export default function App() {
    let [state, setState] = useState<IPopupState | undefined>(undefined);

    useEffect(() => {
        chrome.runtime.sendMessage({ action: BackgroundActionType.GET_STATE }, (message: IPopupGetState) => {
            const state = message.payload.state;
            setState(state);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            {(() => {
                console.log(state);
                if (state == undefined) {
                    return (
                        <div></div>
                    )
                } else if (state.video == undefined) {
                    return (
                        <NotSupported state={state} />
                    )
                } else {
                    return (
                        <Router>
                            <Routes>
                                <Route path="/">
                                    <Route index element={<RecordPage state={state} />} />
                                </Route>
                            </Routes>
                        </Router>
                    );
                }
            })()}
        </ThemeProvider>
    );
}
