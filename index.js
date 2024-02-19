import express from "express";
import { JSONFileSyncPreset } from "lowdb/node";
import { v4 as uuid } from "uuid";
import cors from "cors";
// for password has ----
import bcrypt from "bcrypt";
const saltRounds = 10;
const password = "@Dmin654";
// ------
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const defaultData = { notes: [], users: [] };
const db = JSONFileSyncPreset("./db.json", defaultData);

app.post("/notes", async (req, res) => {
  const { title, content, id } = req.body;

  const existNote = id ? db.data.notes.find((note) => note.id === id) : null;
  if (existNote) {
    const updatedNote = Object.assign(
      db.data.notes.find((note) => note.id === id),
      { content, title, updated: new Date().json() }
    );

    db.write();
    return res.json(updatedNote);
  }

  // new note
  const newNote = {
    id: uuid(),
    title,
    content,
    date: new Date().toJSON(),
    updated: null,
  };
  db.data.notes.push(newNote);
  db.write();
  res.json(newNote);
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  const result = db.data.notes.find((note) => note.id === id);
  res.json(result);
});

app.get("/notes", async (req, res) => {
  res.json(db.data.notes.map((x) => ({ id: x.id, title: x.title, date: x.date })));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
