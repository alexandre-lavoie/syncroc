import React, { useEffect, useState } from "react";
import { BackgroundActionType, IExtensionState, IPopupGetState, IPopupState } from "@syncroc/common";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import RecordStart from "@mui/icons-material/Videocam";
import RecordStop from "@mui/icons-material/VideocamOff";
import ReplayStart from "@mui/icons-material/MovieCreation";
import SaveClip from "@mui/icons-material/Save";

interface IRecordPageProps {
    state: IPopupState
}

export default function RecordPage({ state }: IRecordPageProps) {
    const [isRecording, setRecording] = useState(state.extension.recording);
    const theme = useTheme();

    function onReplay() {
        chrome.runtime.sendMessage({ action: BackgroundActionType.REPLAY_RECORDING });
    }

    function onRecord() {
        let recording = !isRecording;
        setRecording(recording);
        chrome.runtime.sendMessage({ action: recording ? BackgroundActionType.START_RECORDING : BackgroundActionType.STOP_RECORDING });
        if (recording) window.close();
    }

    return (
        <div style={{ width: "400px", height: "400px" }}>
            <AppBar position="fixed" sx={{ padding: 2 }} elevation={0}>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Avatar 
                            src={state.video?.logo}
                            sx={{ width: 64, height: 64 }} 
                        />
                    </Grid>
                </Grid>
                <br/>
                <Typography fontWeight={600} align="center">{state.video?.chanel}</Typography>
                <Typography align="center">{state.video?.title}</Typography>
            </AppBar>

            <AppBar position="fixed" sx={{ top: "auto", bottom: 0, padding: 1 }} elevation={0}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Tooltip title="Record Clip">
                            <IconButton color="inherit" onClick={onRecord}>
                                {(isRecording) ? <RecordStop /> : <RecordStart />}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    {
                        isRecording ?
                            <></>
                            :
                            <>
                                <Grid item>
                                    <Tooltip title="Play Clip">
                                        <IconButton color="inherit" onClick={onReplay}>
                                            <ReplayStart />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Save Clip">
                                        <IconButton color="inherit" onClick={onReplay}>
                                            <SaveClip />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </>
                    }
                </Grid>
            </AppBar>
        </div>
    );
}