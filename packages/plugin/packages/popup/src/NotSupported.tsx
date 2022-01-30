import React, { useEffect } from "react";
import { IPopupState } from "@syncroc/common";
import { useTheme } from "@mui/material/styles";
import InvalidIcon from "@mui/icons-material/DoNotDisturb";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface INotSupportedProps {
    state: IPopupState
}

export default function NotSupported({ state }: INotSupportedProps) {
    const theme = useTheme();

    return (
        <Paper elevation={0} square sx={{ backgroundColor: theme.palette.primary.main, width: 128, height: 128, padding: 4 }}>
            <Grid container spacing={2}>
                <Grid container item justifyContent="center" xs={12}>
                    <InvalidIcon sx={{ color: "white", fontSize: 64 }} />
                </Grid>
                <Grid container item justifyContent="center" xs={12}>
                    <Typography fontWeight={600} sx={{ color: "white", fontSize: 18 }}>Not Supported</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
