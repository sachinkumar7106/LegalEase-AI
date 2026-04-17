import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

export default function PublicLandingPage({ onNavigate }) {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <header className="flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="font-serif text-2xl font-semibold tracking-tight bg-gradient-to-r from-primary to-amber-200 bg-clip-text text-transparent">LegalEase</div>
        <Button variant="ghost" onClick={() => onNavigate("login")} className="font-medium hover:bg-white/10 transition-colors">Sign in</Button>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="text-center px-6 py-24 md:py-36 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> AI-Powered Legal Insights
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[80px] leading-[1.1] font-semibold mb-6 font-serif tracking-tight"
          >
            Draft, Analyze, and <br/>
            <span className="bg-gradient-to-r from-primary via-amber-200 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Win with Confidence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
          >
            The modern AI workspace for top-tier legal teams. Automate contract reviews, detect hidden risks instantly, and access millions of legal precedents.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 items-center w-full sm:w-auto"
          >
            <Button size="lg" className="px-8 font-semibold w-full sm:w-auto rounded-full h-14 text-base shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-all hover:-translate-y-1" onClick={() => onNavigate("auth-intro")}>
              Analyze Now
            </Button>
            <Button variant="outline" size="lg" className="px-8 font-semibold w-full sm:w-auto rounded-full h-14 text-base border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1" onClick={() => onNavigate("auth-intro")}>
              Book a Demo
            </Button>
          </motion.div>
        </section>

        {/* Dashboard Preview / Mockup */}
        <section className="px-6 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto rounded-2xl border border-white/10 bg-black/40 p-2 md:p-4 shadow-2xl backdrop-blur-xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 rounded-2xl pointer-events-none" />
            <div className="rounded-xl overflow-hidden border border-white/5 bg-background shadow-inner aspect-[16/9] flex items-center justify-center relative">
               <div className="absolute top-0 left-0 right-0 h-10 border-b border-border bg-card/50 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-destructive/80" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
               </div>
               <div className="p-8 text-center text-muted-foreground mt-10">
                 <div className="text-4xl mb-4">✨</div>
                 <div className="text-lg font-medium text-foreground">Interactive Legal Dashboard</div>
                 <div className="text-sm">Risk alerts, clause detection, and case management natively integrated.</div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 md:px-12 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-4">Precision Engineered Features</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything you need to streamline legal discovery and drafting.</p>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: "🧠", title: "AI Clause Detection", desc: "Instantly tag and categorize standard lease, corporate, and liability clauses with over 98% exact-match accuracy." },
                { icon: "🚨", title: "Risk Alerts", desc: "Get real-time alerts on asymmetric indemnification, unfavorable terms, or missing regulatory stipulations." },
                { icon: "📄", title: "Document Parsing", desc: "Upload dense, scanned PDFs natively. Abstract extracts raw text intelligently avoiding messy OCR constraints." },
              ].map(f => (
                <motion.div variants={fadeUp} className="bg-black/20 p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all hover:bg-black/40 backdrop-blur-sm group shadow-lg" key={f.title}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-inner">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-32 px-6 md:px-12 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg">A seamless workflow designed for efficiency.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-[45px] left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              {[
                { step: "01", title: "Upload & Organize", desc: "Drag and drop legal documents into secure workspaces. We handle the parsing instantly." },
                { step: "02", title: "AI Analysis", desc: "Our proprietary LLM scans every sentence for anomalies, risks, and standard phrasing." },
                { step: "03", title: "Review Insights", desc: "View a comprehensive, color-coded interactive report. Navigate directly to problematic clauses." }
              ].map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  key={s.step} 
                  className="relative text-center"
                >
                  <div className="w-24 h-24 mx-auto bg-card border border-white/10 rounded-3xl flex items-center justify-center text-primary text-3xl font-serif font-bold mb-8 shadow-2xl relative z-10 before:absolute before:inset-0 before:rounded-3xl before:bg-primary/5 before:backdrop-blur-md">
                    <span className="relative z-10">{s.step}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 md:px-12 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-16">Trusted by Legal Innovators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { quote: "LegalEase AI has cut our contract review time by 60%. The risk detection is shockingly accurate, feeling like a senior partner is double-checking my work.", author: "Sarah Jenkins", role: "Managing Partner, Jenkins & Co." },
                { quote: "The ability to upload a 200-page lease and get a structured risk summary in 30 seconds is game-changing. It's the most polished legal tech we've ever used.", author: "Marcus Thorne", role: "General Counsel, OmniCorp" }
              ].map((t, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="bg-card/50 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-sm"
                  key={i}
                >
                  <div className="text-primary text-4xl font-serif mb-4">"</div>
                  <p className="text-lg text-foreground leading-relaxed mb-8">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-primary-foreground font-semibold">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{t.author}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Placeholder */}
        <section className="py-32 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,168,76,0.1)_0%,transparent_60%)]" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-6">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">Scale your firm's AI capabilities without unpredictable cognitive token charges.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
               {[
                 { name: "Starter", price: "$49", period: "/user/mo", desc: "Perfect for solo practitioners.", features: ["100 Docs/mo", "Basic Analysis", "Standard SLA"] },
                 { name: "Professional", price: "$129", period: "/user/mo", desc: "For boutique law firms.", features: ["Unlimited Docs", "Advanced Clause Review", "Priority Support"], popular: true },
                 { name: "Enterprise", price: "Custom", period: "", desc: "Dedicated infrastructure.", features: ["Complete Data Isolation", "Custom LLM Fine-tuning", "Dedicated Account Manager"] }
               ].map((p, i) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   className={`relative bg-card/80 border p-8 rounded-3xl backdrop-blur-md flex flex-col ${p.popular ? 'border-primary shadow-[0_0_30px_rgba(201,168,76,0.15)] scale-100 md:scale-105 z-10' : 'border-white/10'}`}
                   key={p.name}
                 >
                   {p.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full">Most Popular</div>}
                   <h3 className="text-xl font-medium text-foreground mb-2">{p.name}</h3>
                   <div className="mb-4">
                     <span className="text-4xl font-semibold font-serif text-foreground">{p.price}</span>
                     <span className="text-muted-foreground">{p.period}</span>
                   </div>
                   <p className="text-sm text-muted-foreground border-b border-white/10 pb-6 mb-6">{p.desc}</p>
                   <ul className="flex flex-col gap-4 flex-1 mb-8">
                     {p.features.map(f => (
                       <li className="flex items-center gap-3 text-sm text-foreground" key={f}>
                         <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 text-xs">✓</div>
                         {f}
                       </li>
                     ))}
                   </ul>
                   <Button variant={p.popular ? "default" : "outline"} className={`w-full rounded-full ${p.popular ? '' : 'border-white/10'}`}>Get Started</Button>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="py-12 px-6 md:px-12 border-t border-white/5 text-sm text-muted-foreground bg-black/50 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-serif text-lg font-semibold text-foreground">LegalEase AI</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div>© 2026 LegalEase AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
