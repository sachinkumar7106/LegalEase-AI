import express from "express";
import cors from "cors";
import { analyzeLegalDoc } from "./aiService.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { text } = req.body;
  const result = await analyzeLegalDoc(text);
  res.json(result);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});