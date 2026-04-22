import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/useAuth.js";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Icon, ICONS } from "../components/Icons";
import { toast } from "sonner";
import { Loader2, FileText, AlertTriangle, Lightbulb, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { translateText } from "../utils/translate";
import { LanguageSelector } from "../components/ui/LanguageSelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UploadPage() {
  const { token } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [activeTab, setActiveTab] = useState("Summary");
  const fileInputRef = useRef(null);

  // Clean up ObjectURLs
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.fileUrl) URL.revokeObjectURL(f.fileUrl);
      });
    };
  }, [files]);

  const handleFile = async (file) => {
    if (!file) return;

    const fileItem = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      progress: 0,
      done: false,
      error: null,
      analysis: null,
      fileUrl: URL.createObjectURL(file),
      type: file.type
    };

    setFiles((prev) => [fileItem, ...prev]);
    setSelectedFileName(file.name);
    
    toast("Uploading document...", { description: file.name });

    const formData = new FormData();
    formData.append("document", file);

    let progressInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        )
      );
    }, 500);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-document`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      toast.success("Analysis complete!", { description: `${file.name} successfully analyzed.` });

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, progress: 100, done: true, analysis: data.analysis }
            : f
        )
      );
    } catch (err) {
      clearInterval(progressInterval);
      toast.error("Analysis failed", { description: err.message });
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, progress: 0, error: err.message } : f
        )
      );
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const activeFile = files.find(f => f.name === selectedFileName) || null;
  const { targetLang } = useLanguage();
  const [translatedAnalysis, setTranslatedAnalysis] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const translateAnalysis = async () => {
      if (!activeFile?.analysis || targetLang === "en") {
        if (isMounted) setTranslatedAnalysis(null);
        return;
      }

      setIsTranslating(true);
      try {
        const a = activeFile.analysis;
        const translated = { ...a };

        if (a.document_overview) {
          translated.document_overview = await translateText(a.document_overview, targetLang);
        }
        if (a.clause_tags) {
          translated.clause_tags = await Promise.all(a.clause_tags.map(t => translateText(t, targetLang)));
        }
        if (a.risk_summary) {
          translated.risk_summary = await Promise.all(a.risk_summary.map(async r => ({
            ...r,
            text: await translateText(r.text, targetLang)
          })));
        }
        if (a.important_clauses) {
          translated.important_clauses = await Promise.all(a.important_clauses.map(async c => ({
            ...c,
            text: await translateText(c.text, targetLang),
            explanation: await translateText(c.explanation, targetLang)
          })));
        }

        if (isMounted) setTranslatedAnalysis(translated);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    translateAnalysis();

    return () => { isMounted = false; };
  }, [activeFile?.analysis, targetLang]);

  const displayAnalysis = (targetLang === "en" || showOriginal || !translatedAnalysis) ? activeFile?.analysis : translatedAnalysis;

  return (
    <div className="flex h-full w-full overflow-hidden absolute inset-0">
      <AnimatePresence mode="wait">
        {!activeFile ? (
          <motion.div 
            key="upload-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto p-8 lg:p-12 h-full flex flex-col justify-center"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-semibold text-foreground mb-3">Upload Document for Analysis</h2>
              <p className="text-muted-foreground text-lg">Our AI instantly identifies standard clauses, anomalies, and critical risks.</p>
            </div>

            <input 
              type="file" 
              accept=".pdf" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files?.length > 0) handleFile(e.target.files[0])
              }} 
            />
            <div
              className={`border-2 border-dashed rounded-3xl p-20 text-center cursor-pointer transition-all duration-300 shadow-sm relative overflow-hidden group ${dragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-white/5"}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-20 h-20 mx-auto rounded-2xl bg-card border border-border flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <Icon d={ICONS.upload} size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Click or drag and drop</h3>
              <p className="text-muted-foreground mb-8">PDF documents up to 5MB are supported.</p>
              <Button size="lg" className="pointer-events-none px-8 rounded-full">Select File</Button>
            </div>

            {files.length > 0 && (
              <div className="mt-12">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Recent uploads</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map(f => (
                    <Card 
                      key={f.name} 
                      className="cursor-pointer transition-colors hover:border-primary/50 bg-card/60 backdrop-blur-sm"
                      onClick={() => setSelectedFileName(f.name)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon d={ICONS.file} size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{f.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{f.size}</div>
                        </div>
                        <div className="shrink-0 text-xs font-medium">
                          {f.error ? <span className="text-destructive">Failed</span> : f.done ? <span className="text-emerald-500">Done</span> : <span className="text-primary">Loading</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="split-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row w-full h-full lg:divide-x divide-border overflow-hidden"
          >
            {/* Left Panel - Document Preview */}
            <div className="flex-1 bg-background flex flex-col min-w-0 lg:min-w-[300px]">
              <div className="h-14 border-b border-border flex items-center px-4 bg-card/50 gap-4 shrink-0">
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => setSelectedFileName(null)}>
                  <ChevronLeft size={16} />
                </Button>
                <div className="text-sm font-medium truncate flex-1">{activeFile.name}</div>
                <Badge variant={activeFile.done ? "active" : "pending"} className="shrink-0">
                  {activeFile.done ? "Analyzed" : "Parsing"}
                </Badge>
              </div>
              <div className="flex-1 bg-[#2C2C2C] relative p-1 overflow-hidden">
                 {activeFile.fileUrl && activeFile.type === "application/pdf" ? (
                   <iframe src={`${activeFile.fileUrl}#toolbar=0`} className="w-full h-full rounded-sm bg-white" title="document preview" />
                 ) : (
                   <div className="w-full h-full rounded-sm bg-white p-12 text-black overflow-y-auto font-serif">
                     {displayAnalysis ? (
                       <div className="space-y-6 opacity-70">
                         <div className="h-4 bg-gray-200 rounded w-1/3" />
                         <div className="h-3 bg-gray-200 rounded w-full" />
                         <div className="h-3 bg-gray-200 rounded w-full" />
                         <div className="h-3 bg-gray-200 rounded w-3/4" />
                         {displayAnalysis.important_clauses?.map((c, i) => (
                           <div key={i} className="my-8">
                             <span className="bg-amber-200/50 block p-2 rounded border-l-4 border-amber-500 text-sm">
                               {c.text}
                             </span>
                           </div>
                         ))}
                         <div className="h-3 bg-gray-200 rounded w-full" />
                         <div className="h-3 bg-gray-200 rounded w-full" />
                         <div className="h-3 bg-gray-200 rounded w-5/6" />
                       </div>
                     ) : (
                       <div className="flex items-center justify-center h-full">Document preview available after parsing...</div>
                     )}
                   </div>
                 )}
              </div>
            </div>

            {/* Right Panel - Analysis */}
            <div className="w-full lg:w-[450px] xl:w-[500px] h-1/2 lg:h-full min-h-[400px] shrink-0 bg-card/10 flex flex-col relative overflow-hidden border-t lg:border-t-0 border-border">
              <div className="p-4 px-6 border-b border-border bg-card/50 shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">AI Intelligence Report</h3>
                    {targetLang !== "en" && activeFile.done && (
                      <div className="flex items-center gap-2 mt-2">
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
                  </div>
                </div>
                {activeFile.progress < 100 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                      <span>Analyzing document...</span>
                      <span className="text-primary">{activeFile.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${activeFile.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {!activeFile.done ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                   <Loader2 className="w-8 h-8 text-primary animate-spin mb-6" />
                   <div className="font-medium text-foreground mb-2">Processing Document</div>
                   <p className="text-sm">We are isolating clauses, determining risk vectors, and fetching reference materials right now.</p>
                </div>
              ) : activeFile.error ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-destructive">
                   <AlertTriangle className="w-8 h-8 mb-6" />
                   <div className="font-medium mb-2">Analysis Failed</div>
                   <p className="text-sm mb-6">{activeFile.error}</p>
                   <Button variant="outline" onClick={() => handleFile(files.find(f => f.name === activeFile.name))}>Retry Parsing</Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0 bg-background/50">
                  <div className="flex border-b border-border px-4 shrink-0">
                    {["Summary", "Risks", "Suggestions"].map(tab => (
                      <button 
                        key={tab}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative border-b-2 ${activeTab === tab ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    <AnimatePresence mode="wait">
                      {activeTab === "Summary" && (
                        <motion.div key="Summary" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                          <section>
                            <h4 className="flex items-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                              <FileText size={16} className="mr-2 text-primary" /> Overview
                            </h4>
                            <p className={`text-sm leading-relaxed text-foreground/90 bg-card border border-border p-4 rounded-xl ${isTranslating ? 'opacity-50' : ''}`}>
                              {displayAnalysis.document_overview}
                            </p>
                          </section>
                          
                          {displayAnalysis.clause_tags?.length > 0 && (
                            <section>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Clause Ontology</h4>
                              <div className={`flex flex-wrap gap-2 ${isTranslating ? 'opacity-50' : ''}`}>
                                 {displayAnalysis.clause_tags.map((t, i) => (
                                   <div key={i} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-xs font-medium text-primary shadow-sm">{t}</div>
                                 ))}
                              </div>
                            </section>
                          )}
                        </motion.div>
                      )}

                      {activeTab === "Risks" && (
                        <motion.div key="Risks" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                           <h4 className="flex items-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              <AlertTriangle size={16} className="mr-2 text-destructive" /> Critical Alerts
                           </h4>
                           {displayAnalysis.risk_summary?.length > 0 ? (
                             <div className={`flex flex-col gap-3 ${isTranslating ? 'opacity-50' : ''}`}>
                               {displayAnalysis.risk_summary.map((r, i) => {
                                 const level = r.level?.toLowerCase();
                                 const colorClass = level === 'high' ? 'bg-destructive/10 border-destructive/20 text-destructive' : level === 'low' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500';
                                 const dotClass = level === 'high' ? 'bg-destructive' : level === 'low' ? 'bg-emerald-500' : 'bg-amber-500';
                                 return (
                                   <div key={i} className={`p-4 rounded-xl border ${colorClass}`}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${dotClass} animate-pulse`} />
                                        <div className="text-xs font-bold uppercase tracking-wider">{r.level} RISK DETECTED</div>
                                      </div>
                                      <p className="text-sm leading-relaxed font-medium text-foreground">{r.text}</p>
                                   </div>
                                 )
                               })}
                             </div>
                           ) : (
                             <p className="text-sm text-emerald-500 bg-emerald-500/10 p-4 border border-emerald-500/20 rounded-xl font-medium">No critical risks detected in this document.</p>
                           )}
                        </motion.div>
                      )}

                      {activeTab === "Suggestions" && (
                        <motion.div key="Suggestions" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                           <h4 className="flex items-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              <Lightbulb size={16} className="mr-2 text-amber-500" /> Contract Enhancements
                           </h4>
                           
                           {/* Since API doesn't inherently give "suggestions", map important_clauses as highlighted areas to focus on */}
                           {displayAnalysis.important_clauses?.length > 0 ? (
                              <div className={`flex flex-col gap-4 ${isTranslating ? 'opacity-50' : ''}`}>
                                {displayAnalysis.important_clauses.map((c, i) => (
                                  <div key={i} className="p-5 bg-card border border-border rounded-xl shadow-sm relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <p className="text-sm font-medium text-foreground mb-3 leading-relaxed relative z-10 before:content-[''] before:absolute before:-left-2 before:top-0 before:bottom-0 before:w-1 before:bg-border italic">"{c.text}"</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{c.explanation}</p>
                                  </div>
                                ))}
                              </div>
                           ) : (
                              <p className="text-sm text-muted-foreground">Standard phrasing detected everywhere. No strategic enhancements required.</p>
                           )}
                           <Button className="w-full mt-4">Generate Revisions in Chat</Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
