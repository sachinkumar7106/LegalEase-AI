import pdfParse from "pdf-parse-new";
import { analyzeLegalDoc } from "../aiService.js";

export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or invalid file format. Please upload a PDF." });
    }

    let extractedText = "";
    try {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text.replace(/\n\s*\n/g, "\n\n").trim();
      
      if (!extractedText || extractedText.length < 5) {
        return res.status(400).json({ error: "Could not extract sufficient text from this PDF. It may be scanned or empty." });
      }
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
      return res.status(400).json({ error: "Failed to read the PDF. Please ensure it is a valid text-based PDF." });
    }

    // Send text to Gemini API
    const aiAnalysis = await analyzeLegalDoc(extractedText);

    return res.status(200).json({
      message: "Document successfully analyzed",
      fileName: req.file.originalname,
      size: req.file.size,
      analysis: aiAnalysis,
    });
  } catch (error) {
    console.error("Document Processing Error:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
};
