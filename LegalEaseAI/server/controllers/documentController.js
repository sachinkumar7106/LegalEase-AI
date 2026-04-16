import pdfParse from "pdf-parse-new";
import { analyzeLegalDoc } from "../aiService.js";
import Document from "../models/Document.js";

export const analyzeDocument = async (req, res) => {
  try {
    // ✅ 1. Validate file
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded or invalid file format. Please upload a PDF.",
      });
    }

    let extractedText = "";

    // ✅ 2. Extract text from PDF
    try {
      const pdfData = await pdfParse(req.file.buffer);

      extractedText = pdfData.text
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      if (!extractedText || extractedText.length < 5) {
        return res.status(400).json({
          error:
            "Could not extract sufficient text from this PDF. It may be scanned or empty.",
        });
      }
    } catch (parseError) {
      console.error("❌ PDF Parsing Error:", parseError);

      return res.status(400).json({
        error:
          "Failed to read the PDF. Please ensure it is a valid text-based PDF.",
      });
    }

    // ✅ 3. AI Analysis (SAFE WITH FALLBACK)
    let aiAnalysis;

    try {
      aiAnalysis = await analyzeLegalDoc(extractedText);
    } catch (err) {
      console.warn("⚠️ AI failed after retries:", err.message);

      // 🔥 Fallback structure (matches your AI schema)
      aiAnalysis = {
        document_overview:
          "⚠️ AI analysis unavailable due to high demand. Please try again later.",
        clause_tags: [],
        important_clauses: [],
        risk_summary: [],
        suggestions: [],
      };
    }

    // ✅ 4. Save to MongoDB (ALWAYS)
    const savedDocument = await Document.create({
      title: req.file.originalname,
      originalText: extractedText,

      // 🔥 Match AI schema
      document_overview: aiAnalysis.document_overview,
      clause_tags: aiAnalysis.clause_tags,
      important_clauses: aiAnalysis.important_clauses,
      risk_summary: aiAnalysis.risk_summary,
      suggestions: aiAnalysis.suggestions,
    });

    // ✅ 5. Response
    return res.status(200).json({
      message: "Document processed successfully ✅",

      document: {
        id: savedDocument._id,
        title: savedDocument.title,
        createdAt: savedDocument.createdAt,
      },

      analysis: aiAnalysis,
    });

  } catch (error) {
    console.error("❌ Document Processing Error:", error);

    return res.status(500).json({
      error: error.message || "An unexpected error occurred.",
    });
  }
};