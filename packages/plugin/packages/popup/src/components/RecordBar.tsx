import { IPopupState } from "@syncroc/common";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RecordStart from "@mui/icons-material/Videocam";
import RecordStop from "@mui/icons-material/VideocamOff";
import ClipStart from "@mui/icons-material/PlayArrow";
import ClipStop from "@mui/icons-material/Stop";
import ClipSave from "@mui/icons-material/Save";
import ClipUpload from "@mui/icons-material/Upload";

export interface IControlBarProps {
    state: IPopupState,
    isClipSelect: boolean,
    onPlay?: () => void,
    onRecord?: () => void,
    onSave?: () => void,
    onUpload?: () => void
}

export default function RecordBar({ state, isClipSelect, onPlay, onRecord, onSave, onUpload }: IControlBarProps) {
    return (
        <AppBar position="static" sx={{ top: "auto", bottom: 0, padding: 1 }} elevation={0}>
            <Grid container spacing={2} justifyContent="center">
                {(() => {
                    if (!state.playing) {
                        return (
                            <Grid item>
                                <Tooltip title={state.recording ? "Stop Record" : "Record Clip"}>
                                    <IconButton color="inherit" onClick={() => onRecord?.()}>
                                        {state.recording ? <RecordStop /> : <RecordStart />}
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        );
                    }
                })()}
                {(() => {
                    if (state.playing || (!state.recording && isClipSelect)) {
                        return (
                            <Grid item>
                                <Tooltip title={state.playing ? "Stop Clip" : "Play Clip"}>
                                    <IconButton color="inherit" onClick={() => onPlay?.()}>
                                        {state.playing ? <ClipStop /> : <ClipStart />}
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        );
                    }
                })()}
                {(() => {
                    if (!state.recording && isClipSelect) {
                        return (
                            <Grid item>
                                <Tooltip title="Upload Clip">
                                    <IconButton color="inherit" onClick={() => onUpload?.()}>
                                        <ClipUpload />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        );
                    }
                })()}
            </Grid>
        </AppBar>
    );
}