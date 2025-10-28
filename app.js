import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 3001;

// Allow frontend calls
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));
app.use(bodyParser.json());

// In-memory data
let todos = [];

app.get("/api/todos", (_req, res) => res.json(todos));
app.post("/api/todos", (req, res) => {
  const todo = { id: uuidv4(), text: req.body.text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});
app.put("/api/todos/:id", (req, res) => {
  const t = todos.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: "not found" });
  Object.assign(t, req.body);
  res.json(t);
});
app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter(t => t.id !== req.params.id);
  res.json({ success: true });
});
app.get("/health", (_req, res) => res.send("OK"));

app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
