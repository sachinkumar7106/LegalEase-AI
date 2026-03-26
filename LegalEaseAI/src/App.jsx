import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>LegalEase AI</h1>

      <textarea
        rows={10}
        cols={60}
        placeholder="Paste legal document..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />
      <button onClick={analyze}>Analyze</button>

      {result && (
        <div>
          <h2>Summary</h2>
          <p>{result.summary}</p>

          <h2>Clauses</h2>
          {result.clauses.map((c, i) => (
            <div key={i} style={{ color: c.risk === "HIGH" ? "red" : "black" }}>
              <p><b>{c.text}</b></p>
              <p>Risk: {c.risk}</p>
              <p>Why: {c.reason}</p>
              <p>💡 Suggestion: {c.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;