import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" }
];

export function LanguageSelector() {
  const { targetLang, setTargetLang } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm">
      <Globe size={14} className="text-muted-foreground" />
      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
        className="bg-transparent border-none outline-none text-xs font-medium text-foreground cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-background text-foreground">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
