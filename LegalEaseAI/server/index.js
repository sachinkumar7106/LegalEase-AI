import express from "express";
import cors from "cors";
import { analyzeLegalDoc } from "./aiService.js";
import upload from "./middlewares/upload.js";
import { analyzeDocument } from "./controllers/documentController.js";
import { login, register, googleLogin } from "./controllers/authController.js";
import { requireAuth } from "./middlewares/auth.js";
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/login", login);
app.post("/api/register", register);
app.post("/api/google-login", googleLogin);

app.post("/analyze", requireAuth, async (req, res) => {
  const { text } = req.body;
  const result = await analyzeLegalDoc(text);
  res.json(result);
});

app.post("/upload", requireAuth, upload.single("file"), analyzeDocument);

// Error handler for multer and other middleware errors
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});