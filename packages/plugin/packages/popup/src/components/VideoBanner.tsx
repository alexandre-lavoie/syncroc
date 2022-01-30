import { IVideoState } from "@syncroc/common";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export interface IVideoBannerProps {
    video?: IVideoState
}

export default function VideoBanner({ video }: IVideoBannerProps) {
    if (video === undefined) return <></>;

    return (
        <AppBar position="static" sx={{ padding: 2 }} elevation={0}>
            <Grid container justifyContent="center">
                <Grid item>
                    <Avatar
                        src={video.logo}
                        sx={{ width: 64, height: 64 }}
                    />
                </Grid>
            </Grid>
            <br />
            <Typography fontWeight={600} align="center">{video.title}</Typography>
            <Typography align="center">{video.chanel}</Typography>
        </AppBar>
    );
}
