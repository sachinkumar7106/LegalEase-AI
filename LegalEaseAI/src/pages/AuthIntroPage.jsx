import React from "react";
import { Button } from "../components/ui/Button";

export default function AuthIntroPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans items-center justify-center p-6">
      <div className="bg-card border border-border max-w-lg w-full p-12 text-center rounded-2xl shadow-xl shadow-black/20">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-4xl border border-primary/20 shadow-inner">
          🔒
        </div>
        <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">Protecting Your Data</h2>
        <p className="text-muted-foreground text-[15px] leading-relaxed mb-10 pb-2">
          Legal documents contain highly sensitive, confidential information. To ensure maximum security and privacy, we require you to authenticate before accessing the AI analysis tools. Your documents are securely processed and never used to train generalized models.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Button size="lg" className="w-full font-semibold" onClick={() => onNavigate("login")}>
            Continue to Login
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => onNavigate("landing")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
