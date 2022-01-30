import { useState } from "react";
import { ActionType, BACKEND_URL, IPageProps } from "@syncroc/common";
import { useTheme } from "@mui/material/styles";
import VideoBanner from "../components/VideoBanner";
import ClipList from "../components/ClipList";
import RecordBar from "../components/RecordBar";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export default function RecordPage({ state }: IPageProps) {
    const [selectedClip, setSelectedClip] = useState(-1);
    const [videoId, setVideoId] = useState("");
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    function onPlay() {
        chrome.runtime.sendMessage({ action: ActionType.BACKGROUND_TOGGLE_CLIP, payload: { clipId: selectedClip } });
    }

    function onRecord() {
        let recording = !state.recording;
        chrome.storage.local.set({ recording });
    }

    function onUpload() {
        setVideoId(state?.video?.id as string);
        setOpen(true);
    }

    async function upload(videoId: string) {
        let clip = state.clips[selectedClip];

        if (clip.length === 0) return;

        const response = await fetch(`${BACKEND_URL}/clip/${videoId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ clip })
        });
    }

    return (
        <>
            <div style={{ width: "400px" }}>
                <VideoBanner video={state.video} />
                <ClipList clips={state.clips} onSelect={(clipId: number) => setSelectedClip(clipId)} />
                <RecordBar state={state} isClipSelect={selectedClip >= 0} onPlay={onPlay} onRecord={onRecord} onUpload={onUpload} />
            </div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Video ID"
                        fullWidth
                        variant="standard"
                        value={videoId}
                        onChange={(ev) => setVideoId(ev.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => { 
                        upload(videoId as string); 
                        setOpen(false); 
                        setVideoId("");
                        setSelectedClip(-1); 
                    }}>Upload</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}