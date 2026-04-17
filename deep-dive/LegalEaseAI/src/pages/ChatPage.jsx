import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth.js";
import { Button } from "../components/ui/Button";
import { Icon, ICONS } from "../components/Icons";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ChatPage({ pageData, onNav }) {
  const { token } = useAuth();
  const [input, setInput] = useState("");
  const getInitialMessages = () => {
    const base = [
      {
        role: "ai",
        text: "Good morning. I'm your LegalEase AI assistant. I can help you analyze contracts, research case law, draft legal memos, and answer questions about your active matters. What can I help you with today?",
      }
    ];

    if (pageData?.context) {
      return [
        {
          role: "user",
          text: `I want to discuss the analysis for "${pageData.docName}". Here is the full context from the legal analysis: ${JSON.stringify(pageData.context)}. Please use this specific document data to answer my future questions.`,
          hidden: true
        },
        {
          role: "ai",
          text: `I've loaded the analysis for "${pageData.docName}". I've identified the key clauses and risks we discussed in the report. How would you like to revise or proceed with this contract?`
        }
      ];
    }
    return base;
  };

  const [messages, setMessages] = useState(getInitialMessages());
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/chat-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setThreads(data);
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      }
    };
    fetchThreads();
  }, [token]);
  const chips = ["Summarize key obligations", "Identify indemnification clauses", "Check jurisdiction", "Draft response memo"];

  const [sending, setSending] = useState(false);

  const resetChat = () => {
    onNav("chat", null); // Clear context data
    setMessages([
      {
        role: "ai",
        text: "Good morning. I'm your LegalEase AI assistant. I can help you analyze contracts, research case law, draft legal memos, and answer questions about your active matters. What can I help you with today?",
      }
    ]);
    setInput("");
    setThreads(prev => prev.map(t => ({ ...t, active: false })));
    toast("Started new conversation");
  };

  const handleThreadClick = (thread) => {
    setThreads(prev => prev.map(t => ({
      ...t,
      active: t.id === thread.id
    })));
    setMessages(thread.messages || []);
    toast(`Switched to thread: ${thread.title}`);
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    
    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setSending(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Chat service unavailable");
      }

      const data = await response.json();
      const newAiMessage = { role: "ai", text: data.text };
      const newMessages = [...updatedMessages, newAiMessage];
      setMessages(newMessages);

      // Save to history after the first AI response
      if (newMessages.filter(m => !m.hidden).length >= 3) {
        try {
          await fetch(`${API_BASE_URL}/chat-history`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              title: input.substring(0, 30) + (input.length > 30 ? "..." : ""),
              preview: data.text.substring(0, 50) + "...",
              date: "Today",
              messages: newMessages
            })
          });
        } catch (e) {
          console.error("Failed to save chat history:", e);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("AI Assistant is offline");
      setMessages(m => [
        ...m, 
        { role: "ai", text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment." }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-[280px_1fr] h-[calc(100vh-64px)] overflow-hidden">
      <div className="bg-card/50 backdrop-blur-sm border-r border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <Button variant="default" className="w-full justify-center gap-2 font-medium" onClick={resetChat}>
            <Icon d={ICONS.plus} size={14} /> New conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map(t => (
            <div 
              key={t.id || t.title}
              className={`p-4 cursor-pointer border-b border-border/30 transition-colors hover:bg-white/5 ${t.active ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"}`}
              onClick={() => handleThreadClick(t)}
            >
              <div className="text-sm font-medium text-foreground mb-1">{t.title}</div>
              <div className="text-xs text-muted-foreground truncate">{t.preview}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-2 font-medium">{t.date}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full bg-background relative">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col gap-8 pb-32">
          {messages.filter(m => !m.hidden).map((m, i) => (
            <div className={`flex gap-4 max-w-4xl w-full ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`} key={i}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-medium text-sm border ${m.role === "ai" ? "bg-primary/10 border-primary/20 text-primary" : "bg-card border-border text-muted-foreground"}`}>
                {m.role === "ai" ? "L" : "ME"}
              </div>
              <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed max-w-[85%] ${m.role === "user" ? "bg-primary/10 border border-primary/20 text-foreground rounded-tr-sm" : "bg-card border border-border text-card-foreground rounded-tl-sm"}`}>
                {m.text}
                {m.cite && (
                  <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border/50 border-l-2 border-l-primary text-xs text-muted-foreground">
                    {m.cite}
                  </div>
                )}
              </div>
            </div>
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
