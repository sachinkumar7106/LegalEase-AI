import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Explicitly define the system instructions to enforce JSON output as required.
const LEGAL_ANALYSIS_PROMPT = `
You are an expert legal AI assistant. Analyze the provided legal document text and output the results STRICTLY as a JSON object.
Do not include markdown blocks, backticks, or any other text outside the JSON.
Identify any risky legal clauses, explain why they are risky, and suggest safer alternatives.
The JSON must have exactly these keys:
- "summary": A brief summary of the document in simple English.
- "risks": An array of risk objects. Each object must have:
  - "clause": The text of the risky clause.
  - "risk": An explanation of why it is risky.
  - "suggestion": A safer alternative or negotiation suggestion.
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGeminiWithRetry(promptText, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json" },
      });
      const response = await result.response;
      const textOutput = response.text();
      return JSON.parse(textOutput);
    } catch (error) {
      if (i === retries - 1) {
        console.error("Gemini API Error after retries:", error.message || error);
        throw new Error("Analysis engine failed. Please try again later.");
      }
      await delay(1000 * (i + 1));
    }
  }
}

export async function analyzeLegalDoc(text) {
  if (!text || text.trim().length === 0) {
    throw new Error("Text provided for analysis is empty.");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in .env file.");
  }

  const CHUNK_SIZE = 60000;
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.substring(i, i + CHUNK_SIZE));
  }

  let finalSummary = "";
  let allRisks = [];

  // Process chunks sequentially
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    const promptText = `${LEGAL_ANALYSIS_PROMPT}\n\n--- Document Text Part ${i + 1}/${chunks.length} ---\n${chunkText}\n--- End of Document Text ---`;
    
    const resultObj = await callGeminiWithRetry(promptText);

    if (resultObj.summary) {
      finalSummary += resultObj.summary + " ";
    }
    if (resultObj.risks && Array.isArray(resultObj.risks)) {
      allRisks = allRisks.concat(resultObj.risks);
    }
  }

  let combinedSummary = finalSummary.trim();
  
  // If there were multiple chunks, do a final merge summarization
  if (chunks.length > 1) {
    const summaryPrompt = `Summarize the following combined text into a single cohesive overall summary in simple English. Output STRICTLY as JSON with the key "summary":\n\n${combinedSummary}`;
    try {
      const summaryResult = await callGeminiWithRetry(summaryPrompt);
      if (summaryResult.summary) {
        combinedSummary = summaryResult.summary;
      }
    } catch (err) {
      console.warn("Failed to generate final merged summary, falling back to concatenated summary.", err);
    }
  }

  return {
    summary: combinedSummary,
    risks: allRisks,
  };
}