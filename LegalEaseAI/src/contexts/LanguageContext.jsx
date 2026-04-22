import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [targetLang, setTargetLang] = useState(() => {
    return localStorage.getItem("app_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", targetLang);
  }, [targetLang]);

  return (
    <LanguageContext.Provider value={{ targetLang, setTargetLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
