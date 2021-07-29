import * as functions from "firebase-functions";
import * as express from "express";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import {addNote, getAllNotes, updateNote, deleteNote} from "./noteController";
import {isAuthenticated} from "./auth/authenticated";

const app = express();
app.get("/", (req, res) => res.status(200).send("Hey there!"));

app.post("/note", isAuthenticated, addNote);

app.get("/notes", isAuthenticated, getAllNotes);

app.patch("/notes/:noteId", updateNote);

app.delete("/notes/:noteId", deleteNote);

exports.app = functions.https.onRequest(app);
