import { IMediaClip } from "@syncroc/common";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Video from "@mui/icons-material/MovieCreation";

export interface IClipListProps {
    clips: IMediaClip[],
    filterId?: string,
    onSelect?: (clipId: number) => void
}

export default function ClipList({ clips, filterId, onSelect }: IClipListProps) {
    return (
        <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
            {clips
                .map((clip, index) => ({ clip, index }))
                .filter(({ clip }) => clip.length > 0 && (filterId === undefined || clip[0].media.id === filterId))
                .map(({ clip, index }) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => onSelect?.(index)}>
                            <ListItemIcon>
                                <Video />
                            </ListItemIcon>
                            <ListItemText primary={clip.length > 0 ? `Clip ${clip[0].media.id}` : `Clip Empty`} secondary={clip.length > 0 ? new Date(clip[0].time).toLocaleString("en-us") : ""} />
                        </ListItemButton>
                    </ListItem>
                )).reverse()}
        </List>
    );
}