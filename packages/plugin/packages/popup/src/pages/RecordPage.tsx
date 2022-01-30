import { useState } from "react";
import { ActionType, IPageProps } from "@syncroc/common";
import { useTheme } from "@mui/material/styles";
import VideoBanner from "../components/VideoBanner";
import ClipList from "../components/ClipList";
import RecordBar from "../components/RecordBar";

export default function RecordPage({ state }: IPageProps) {
    const [selectedClip, setSelectedClip] = useState(-1);
    const theme = useTheme();

    function onPlay() {
        chrome.runtime.sendMessage({ action: ActionType.BACKGROUND_TOGGLE_CLIP, payload: { clipId: selectedClip } });
    }

    function onRecord() {
        let recording = !state.recording;
        chrome.storage.local.set({ recording });
    }

    return (
        <div style={{ width: "400px" }}>
            <VideoBanner video={state.video} />
            <ClipList clips={state.clips} filterId={state.video?.id} onSelect={(clipId: number) => setSelectedClip(clipId)} />
            <RecordBar state={state} isClipSelect={selectedClip >= 0} onPlay={onPlay} onRecord={onRecord} />
        </div>
    );
}