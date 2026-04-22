const translationCache = new Map();

export const translateText = async (text, targetLang) => {
  if (!text || typeof text !== "string") return text;
  if (targetLang === "en") return text;

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    // We use the free Google Translate API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Translation request failed");
    }

    const data = await response.json();
    
    // Google Translate returns an array of segments
    let translatedText = "";
    if (data && data[0] && Array.isArray(data[0])) {
      data[0].forEach((segment) => {
        if (segment[0]) {
          translatedText += segment[0];
        }
      });
    } else {
      throw new Error("Unexpected translation response format");
    }

    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    // Fallback to English
    return text;
  }
};
