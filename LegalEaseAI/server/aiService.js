import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in .env file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// 🔁 Retry delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 🧠 Strict prompt
const LEGAL_ANALYSIS_PROMPT = `
You are an expert legal AI assistant. Analyze the provided legal document text and output the results STRICTLY as a JSON object.
Do not include markdown blocks, backticks, or any other text outside the JSON. The JSON must have exactly these keys:
- "document_overview": A brief summary of the document.
- "clause_tags": An array of important string tags.
- "important_clauses": An array of objects with "text" and "explanation".
- "risk_summary": An array of risk objects with "level" and "text".
- "suggestions": An array of actionable suggestions.
`;

export async function analyzeLegalDoc(text) {
  const MAX_RETRIES = 3;

  // 🔒 Limit input size
  const MAX_CHARS = 500000;
  const safeText =
    text.length > MAX_CHARS
      ? text.substring(0, MAX_CHARS) + "\n...[truncated]"
      : text;

  const promptText = `${LEGAL_ANALYSIS_PROMPT}\n\n--- Document Text ---\n${safeText}\n--- End ---`;
  const model = getModel();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🤖 Gemini محاولة ${attempt}...`);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const response = await result.response;
      const textOutput = response.text();

      // 🔍 Try parsing safely
      try {
        return JSON.parse(textOutput);
      } catch {
        console.error("❌ JSON Parse Error:", textOutput);
        throw new Error("AI returned invalid JSON format.");
      }

    } catch (error) {
      console.error(`⚠️ Attempt ${attempt} failed:`, error.message);

      // 🚨 If last attempt → throw error
      if (attempt === MAX_RETRIES) {
        throw new Error("Analysis engine failed after multiple attempts.");
      }

      // ⏳ Wait before retry
      await delay(2000 * attempt);
    }
  }
}
