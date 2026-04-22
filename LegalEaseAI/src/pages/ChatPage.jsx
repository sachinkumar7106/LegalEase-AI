import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Icon, ICONS } from "../components/Icons";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translateText } from "../utils/translate";
import { LanguageSelector } from "../components/ui/LanguageSelector";

const ChatMessage = ({ m }) => {
  const { targetLang } = useLanguage();
  const [translatedText, setTranslatedText] = useState(m.text);
  const [translatedCite, setTranslatedCite] = useState(m.cite);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const translate = async () => {
      if (m.role === "user" || targetLang === "en") {
        if (isMounted) {
          setTranslatedText(m.text);
          setTranslatedCite(m.cite);
          setIsTranslating(false);
        }
        return;
      }

      setIsTranslating(true);
      try {
        const textPromise = translateText(m.text, targetLang);
        const citePromise = m.cite ? translateText(m.cite, targetLang) : Promise.resolve(null);
        
        const [resText, resCite] = await Promise.all([textPromise, citePromise]);
        
        if (isMounted) {
          setTranslatedText(resText);
          setTranslatedCite(resCite);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    translate();

    return () => { isMounted = false; };
  }, [m.text, m.cite, targetLang, m.role]);

  const displayText = targetLang === "en" || showOriginal ? m.text : translatedText;
  const displayCite = targetLang === "en" || showOriginal ? m.cite : translatedCite;

  return (
    <div className={`flex gap-4 max-w-4xl w-full ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-medium text-sm border ${m.role === "ai" ? "bg-primary/10 border-primary/20 text-primary" : "bg-card border-border text-muted-foreground"}`}>
        {m.role === "ai" ? "L" : "ME"}
      </div>
      <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed max-w-[85%] ${m.role === "user" ? "bg-primary/10 border border-primary/20 text-foreground rounded-tr-sm" : "bg-card border border-border text-card-foreground rounded-tl-sm relative"}`}>
        {m.role === "ai" && targetLang !== "en" && (
          <div className="absolute -top-3 right-2 flex items-center gap-2">
             <button 
               onClick={() => setShowOriginal(!showOriginal)}
               className="text-[10px] bg-card border border-border rounded-full px-2 py-0.5 text-muted-foreground hover:text-primary transition-colors"
             >
               {showOriginal ? "Show Translated" : "Show Original"}
             </button>
             {isTranslating && <Loader2 size={12} className="animate-spin text-primary" />}
             {!isTranslating && !showOriginal && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Translated to {targetLang.toUpperCase()}</span>}
          </div>
        )}
        <div className={isTranslating ? "opacity-50" : ""}>
          {displayText}
          {displayCite && (
            <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border/50 border-l-2 border-l-primary text-xs text-muted-foreground">
              {displayCite}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Good morning. I'm your LegalEase AI assistant. I can help you analyze contracts, research case law, draft legal memos, and answer questions about your active matters. What can I help you with today?",
    },
    {
      role: "user",
      text: "What are the key risks in the Orion Ventures NDA I uploaded earlier?",
    },
    {
      role: "ai",
      text: "I've reviewed the Orion Ventures NDA (uploaded Oct 14, 2024). Here are the three primary risk areas I identified:",
      cite: "§4.2 — The non-compete clause extends to \"adjacent markets\" without a definition, which could be interpreted broadly to restrict your client's operations in the SaaS sector. §7.1 — The indemnification obligation is mutual but contains an asymmetric carve-out favoring Orion. §9 — The governing law clause selects Delaware courts but the parties are both incorporated in California.",
    },
  ]);
  const threads = [
    { title: "Orion Ventures NDA review", preview: "Three primary risk areas...", date: "Today", active: true },
    { title: "Henderson deposition prep", preview: "Based on the deposition...", date: "Yesterday" },
    { title: "Estate planning research", preview: "Under California probate...", date: "Oct 12" },
    { title: "Retail lease walkthrough", preview: "The lease contains a force...", date: "Oct 8" },
  ];
  const chips = ["Summarize key obligations", "Identify indemnification clauses", "Check jurisdiction", "Draft response memo"];

  const [sending, setSending] = useState(false);

  const send = () => {
    if (!input.trim() || sending) return;
    
    // Add user message
    setMessages(m => [...m, { role: "user", text: input }]);
    setInput("");
    setSending(true);
    
    // Simulate API delay
    setTimeout(() => {
      setMessages(m => [
        ...m, 
        { role: "ai", text: "I understand your query. However, I am currently running in a demo environment without active backend context hooks connected to this chat thread. To test full legal analysis, please head to the Document Analysis tool." }
      ]);
      setSending(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-[280px_1fr] h-[calc(100vh-64px)] overflow-hidden">
      <div className="bg-card/50 backdrop-blur-sm border-r border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <Button variant="default" className="w-full justify-center gap-2 font-medium">
            <Icon d={ICONS.plus} size={14} /> New conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map(t => (
            <div className={`p-4 cursor-pointer border-b border-border/30 transition-colors hover:bg-white/5 ${t.active ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"}`} key={t.title}>
              <div className="text-sm font-medium text-foreground mb-1">{t.title}</div>
              <div className="text-xs text-muted-foreground truncate">{t.preview}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-2 font-medium">{t.date}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full bg-background relative">
        <div className="absolute top-4 right-6 z-10">
          <LanguageSelector />
        </div>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-8 pb-32">
          {messages.map((m, i) => (
            <ChatMessage key={i} m={m} />
          ))}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-0 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-4xl mx-auto w-full">
            {sending && (
              <div className="flex gap-2 mb-4 ml-2">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-75" />
                <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse delay-150" />
              </div>
            )}
            {!sending && (
              <div className="flex flex-wrap gap-2 mb-4">
                {chips.map(c => (
                  <button 
                    className="px-4 py-1.5 rounded-full border border-border bg-card/60 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors backdrop-blur-sm"
                    key={c} 
                    onClick={() => setInput(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex items-end gap-3 bg-card border border-border rounded-xl p-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-lg">
              <textarea
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-foreground min-h-[24px] max-h-[160px] py-2 px-1 scrollbar-thin"
                placeholder="Ask a legal question or reference a document..."
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />
              <Button size="icon" className="shrink-0 rounded-lg h-10 w-10" onClick={send} disabled={sending}>
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Icon d={ICONS.send} size={16} className="ml-0.5" />}
              </Button>
            </div>
            <div className="text-center text-[10px] text-muted-foreground mt-3 font-medium">
              LegalEase AI can make mistakes. Consider verifying critical legal information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

