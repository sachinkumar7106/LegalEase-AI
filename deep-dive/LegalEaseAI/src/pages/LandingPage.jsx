import React from "react";
import { Button } from "../components/ui/Button";

export default function LandingPage({ onNav }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center px-12 py-20 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-primary mb-8 font-medium">
        <span className="w-8 h-px bg-primary block" /> AI-Powered Legal Intelligence
      </div>
      
      <h1 className="text-5xl lg:text-[64px] leading-[1.1] font-semibold text-foreground mb-6 font-serif">
        Legal clarity,<br/>
        <em className="font-serif italic text-primary/90">without the complexity.</em>
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10 pb-2">
        LegalEase AI transforms how you interact with legal documents, cases, and research. Powered by large language models built specifically for the legal domain.
      </p>
      
      <div className="flex flex-wrap gap-4 mb-16">
        <Button size="lg" className="px-8 font-semibold text-sm" onClick={() => onNav("dashboard")}>
          Go to Dashboard
        </Button>
        <Button variant="outline" size="lg" className="px-8 font-medium text-sm border-border hover:border-primary/50" onClick={() => onNav("chat")}>
          See it in action
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 bg-card border border-border rounded-xl mb-20 shadow-sm max-w-3xl divide-y md:divide-y-0 md:divide-x divide-border">
        {[
          { num: "98%", label: "Contract accuracy" },
          { num: "12x", label: "Faster review" },
          { num: "40k+", label: "Cases analyzed" }
        ].map(stat => (
          <div className="p-6 md:p-8" key={stat.label}>
            <div className="text-3xl font-serif font-bold text-primary mb-1">{stat.num}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border border border-border rounded-2xl overflow-hidden shadow-sm">
        {[
          { icon: "⚖️", title: "Legal Q&A", desc: "Ask anything. Get precise answers grounded in case law, statutes, and your own documents.", target: "chat" },
          { icon: "📄", title: "Contract analysis", desc: "Automatically surface clauses, obligations, risks, and inconsistencies in any agreement.", target: "upload" },
          { icon: "📁", title: "Case management", desc: "Organize matters, track deadlines, and keep all related documents in one place.", target: "cases" },
          { icon: "🔍", title: "Smart research", desc: "Cite-backed answers across millions of legal sources, powered by retrieval-augmented generation.", target: "chat" },
        ].map(f => (
          <div className="bg-card p-8 h-full cursor-pointer hover:bg-white/[0.02] transition-colors" key={f.title} onClick={() => onNav(f.target)}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg mb-4 shadow-inner">
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
