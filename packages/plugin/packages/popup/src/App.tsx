import { useEffect, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ActionType, IMediaClip, IPopupVideoData, IVideoState } from "@syncroc/common";
import MainPage from "./pages/MainPage";
import RecordPage from "./pages/RecordPage";
import NotSupported from "./pages/NotSupported";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0CCA4A",
            contrastText: "#FFFFFF"
        }
    }
});

export default function App() {
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [recording, setRecording] = useState(false);
    const [currentClip, setCurrentClip] = useState<IMediaClip | undefined>(undefined);
    const [clips, setClips] = useState<IMediaClip[]>([]);
    const [video, setVideo] = useState<IVideoState | undefined>(undefined);

    useEffect(() => {
        chrome.runtime.sendMessage({ action: ActionType.BACKGROUND_POPUP_VIDEO_DATA }, (response: IPopupVideoData) => {
            setVideo(response.payload.video);
        });

        chrome.storage.local.get(["playing", "recording", "currentClip", "clips"], ({ playing, recording, currentClip, clips }) => {
            if (playing) setPlaying(playing);
            if (recording) setRecording(recording);
            if (currentClip) setCurrentClip(currentClip);
            if (clips) setClips(clips);

            setLoading(false);
        });

        chrome.storage.onChanged.addListener((changes, area) => {
            if (changes?.playing?.newValue !== undefined) setPlaying(changes.playing.newValue);
            if (changes?.recording?.newValue !== undefined) setRecording(changes.recording.newValue);
            if (changes?.currentClip?.newValue !== undefined) setCurrentClip(changes.currentClip.newValue);
            if (changes?.clips?.newValue !== undefined) setClips(changes.clips.newValue);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            {(() => {
                if (loading) {
                    return (
                        <div></div>
                    )
                } else if (video == undefined) {
                    return (
                        <NotSupported />
                    )
                } else {
                    return (
                        <Router>
                            <Routes>
                                <Route path="/">
                                    <Route index element={<RecordPage state={{ playing, recording, currentClip, clips, video }} />} />
                                </Route>
                            </Routes>
                        </Router>
                    );
                }
            })()}
        </ThemeProvider>
    );
}
