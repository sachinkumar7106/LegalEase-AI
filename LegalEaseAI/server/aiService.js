import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Explicitly define the system instructions to enforce JSON output as required.
const LEGAL_ANALYSIS_PROMPT = `
You are an expert legal AI assistant. Analyze the provided legal document text and output the results STRICTLY as a JSON object.
Do not include markdown blocks, backticks, or any other text outside the JSON. The JSON must have exactly these keys:
- "document_overview": A brief summary of the document.
- "clause_tags": An array of important string tags (e.g., ["Termination", "Liability", "Confidentiality"]).
- "important_clauses": An array of objects with "text" (clause snippet) and "explanation".
- "risk_summary": An array of risk objects, each with "level" ("high", "medium", or "low") and "text" (description).
- "suggestions": An array of actionable suggestions based on the document.
`;

export async function analyzeLegalDoc(text) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in .env file.");
    }

    // Handle large documents using a simple character limit for now (safeguard)
    // Gemini 1.5 flash has a large context length, but we ensure string isn't unboundedly huge
    const MAX_CHARS = 500000;
    const safeText = text.length > MAX_CHARS ? text.substring(0, MAX_CHARS) + "\n...[truncated due to length]" : text;

    const promptText = `${LEGAL_ANALYSIS_PROMPT}\n\n--- Document Text ---\n${safeText}\n--- End of Document Text ---`;
    
    // Call Gemini API natively enforcing JSON output
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: "application/json" },
    });
    
    const response = await result.response;
    const textOutput = response.text();

    return JSON.parse(textOutput);
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    
    if (error instanceof SyntaxError) {
      throw new Error("AI returned invalid data format.");
    }
    
    throw new Error("Analysis engine failed. Please try again later.");
  }
}