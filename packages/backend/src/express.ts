import { IMediaClip, normalizeMediaClip } from "@syncroc/common";
import * as express from "express";
import * as cors from "cors";
const app = express();
const port = 3000;

app.use(cors({
    origin: "*"
}));
app.use(express.json());

let clips: { [key: string]: IMediaClip } = {};

app.get("/clip/:id", (req, res) => {
    let id: string = req.params.id;

    console.log(`[Download] ${id}`)
    if (clips[id] === undefined) {
        res.send({ "error": "Not Found" });
    } else {
        res.send(clips[id]);
    }
});

app.post("/clip/:id", (req, res) => {
    let id: string = req.params.id;
    let clip: IMediaClip = req.body.clip;

    clips[id] = normalizeMediaClip(clip);

    console.log(`[Upload] ${id}`)
    res.send({ "result": "Success" });
});

app.listen(port, () => {
    console.log(`🐊 Syncroc Backend 🐊\n\n[URL] http://localhost:${port}/`);
});
