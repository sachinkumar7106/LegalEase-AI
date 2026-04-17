import { GoogleGenerativeAI } from '@google/generative-ai';
import './config/loadEnv.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const LEGAL_ANALYSIS_PROMPT = `
You are an expert legal AI assistant. Analyze the provided legal document text and output the results STRICTLY as a JSON object.
Do not include markdown blocks, backticks, or any other text outside the JSON. The JSON must have exactly these keys:
- "document_overview": A brief summary of the document.
- "clause_tags": An array of important string tags.
- "important_clauses": An array of objects with "text" and "explanation".
- "risk_summary": An array of risk objects with "level" and "text".
- "suggestions": An array of actionable suggestions.
`;

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in .env file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

export async function analyzeLegalDoc(text) {
  const MAX_RETRIES = 3;
  const MAX_CHARS = 500000;
  const safeText = text.length > MAX_CHARS ? `${text.substring(0, MAX_CHARS)}\n...[truncated]` : text;
  const promptText = `${LEGAL_ANALYSIS_PROMPT}\n\n--- Document Text ---\n${safeText}\n--- End ---`;
  const model = getModel();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}...`);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const response = await result.response;
      const textOutput = response.text();

      try {
        return JSON.parse(textOutput);
      } catch {
        console.error('Invalid JSON returned by Gemini:', textOutput);
        throw new Error('AI returned invalid JSON format.');
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      const statusCode = error?.status || error?.statusCode || error?.cause?.status;
      const isBusyError =
        statusCode === 429 ||
        statusCode === 503 ||
        /high demand|temporarily unavailable|service unavailable|overloaded/i.test(error.message);

      if (attempt === MAX_RETRIES) {
        if (isBusyError) {
          throw new Error('Analysis service is temporarily busy. Please try again in a moment.');
        }

        throw new Error('Analysis engine failed after multiple attempts.');
      }

      await delay(2000 * attempt);
    }
  }
}

export async function chatWithAI(messages) {
  try {
    const model = getModel();
    
    // Convert messages to Gemini format
    const contents = messages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const systemPrompt = "You are an expert legal AI assistant. Provide clear, accurate, and professional legal insights. Ground your answers in case law and statutes where possible. Be concise but thorough.";
    
    // Add system prompt if not present
    if (contents.length > 0 && contents[0].role !== 'system') {
      // Gemini 1.5/2.0 supports system instruction, but for simplicity we can just prepend it or use the model config
      // Let's prepend it to the first user message or as a separate message if the model supports it.
      // For gemini-2.5-flash (if that's what's used), we can pass it in systemInstruction
    }

    const result = await model.generateContent({
      contents: contents,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chat error:', error.message);
    throw new Error('AI chat failed');
  }
}
