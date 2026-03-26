import React from "react";

const About = () => {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>About LegalEase AI</h1>

      <p>
        LegalEase AI is designed to simplify complex legal documents into plain,
        understandable language. Most students and professionals sign agreements
        without fully understanding them — we aim to fix that.
      </p>

      <p>
        Our platform analyzes legal text, highlights risky clauses, and provides
        actionable suggestions so you know exactly what you’re agreeing to.
      </p>

      <h2>What We Do</h2>
      <ul>
        <li>📄 Simplify legal documents</li>
        <li>⚠️ Detect risky clauses</li>
        <li>💡 Suggest negotiation points</li>
        <li>🧠 AI-powered explanations</li>
      </ul>

      <h2>Our Mission</h2>
      <p>
        To make legal understanding accessible to everyone, regardless of their
        background.
      </p>
    </div>
  );
};

export default About;