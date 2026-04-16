import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { analyzeLegalDoc } from "./aiService.js";
import upload from "./middlewares/upload.js";
import { analyzeDocument } from "./controllers/documentController.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// 🔥 Connect DB FIRST and then start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Routes
    app.get("/", (req, res) => {
      res.send("API is running...");
    });

    app.post("/analyze", async (req, res) => {
      try {
        const { text } = req.body;

        if (!text) {
          return res.status(400).json({ error: "Text is required" });
        }

        const result = await analyzeLegalDoc(text);
        res.json(result);
      } catch (error) {
        console.error("❌ Analyze Error:", error.message);
        res.status(500).json({ error: "AI processing failed" });
      }
    });

    app.post(
      "/analyze-document",
      upload.single("document"),
      analyzeDocument
    );

    // Global Error Handler
    app.use((err, req, res, next) => {
      console.error("❌ Error:", err.message);
      res.status(400).json({ error: err.message });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();