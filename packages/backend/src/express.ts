import { IMediaClip, normalizeMediaClip } from "@syncroc/common";
import * as express from "express";
import * as cors from "cors";
import * as fs from "fs";
const app = express();
const port = 3000;

app.use(cors({
    origin: "*"
}));
app.use(express.json());

let db: { [key: string]: IMediaClip } = {};

function loadDB() {
    if (!fs.existsSync("./db.json")) return;
    db = JSON.parse(fs.readFileSync("./db.json").toString());
}
loadDB();

function setDB(newDB: { [key: string]: IMediaClip }) {
    db = newDB;
    fs.writeFileSync("./db.json", JSON.stringify(newDB));
}

app.get("/clip/:id", (req, res) => {
    let id: string = req.params.id;

    console.log(`[Download] ${id}`)
    if (db[id] === undefined) {
        res.send({ "error": "Not Found" });
    } else {
        res.send(db[id]);
    }
});

app.post("/clip/:id", (req, res) => {
    let id: string = req.params.id;
    let clip: IMediaClip = req.body.clip;

    setDB({
        ...db,
        [id]: normalizeMediaClip(clip)
    });

    console.log(`[Upload] ${id}`)
    res.send({ "result": "Success" });
});

app.listen(port, () => {
    console.log(`🐊 Syncroc Backend 🐊\n\n[URL] http://localhost:${port}/`);
});
