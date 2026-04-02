import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
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
    <div style={styles.container}>

      {/* Section 1 - Upload */}
      <div style={styles.card}>
        <h3>📄 Upload Document</h3>
        <textarea
          placeholder="Paste legal document..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={analyze} style={styles.button}>Analyze</button>
      </div>

      {/* Section 2 - AI Output */}
      <div style={styles.card}>
        <h3>🤖 AI Output</h3>

        {result ? (
          <>
            <h4>Summary</h4>
            <p>{result.summary}</p>

            <h4>Clauses</h4>
            {result.clauses.map((c, i) => (
              <div key={i} style={{ marginBottom: "10px", color: c.risk === "HIGH" ? "red" : "white" }}>
                <p><b>{c.text}</b></p>
                <p>Risk: {c.risk}</p>
                <p>Why: {c.reason}</p>
                <p>💡 {c.suggestion}</p>
              </div>
            ))}
          </>
        ) : (
          <p>AI response will appear here...</p>
        )}
      </div>

      {/* Section 3 - Gemini Tips */}
      <div style={styles.card}>
        <h3>💡 Gemini Tips</h3>
        <ul>
          <li>Always review high-risk clauses carefully</li>
          <li>Check for hidden obligations</li>
          <li>Look for termination conditions</li>
          <li>Verify payment terms</li>
        </ul>
      </div>

    </div>
  );
}

function About() {
  return <h2 style={styles.page}>About LegalEase AI</h2>;
}

function Contact() {
  return <h2 style={styles.page}>Contact Us</h2>;
}

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2>LegalEase AI</h2>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#111",
    color: "white"
  },
  link: {
    margin: "0 10px",
    color: "white",
    textDecoration: "none"
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    padding: "30px"
  },
  card: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    color: "white",
    minHeight: "300px"
  },
  textarea: {
    width: "100%",
    height: "150px",
    marginTop: "10px"
  },
  button: {
    marginTop: "10px",
    padding: "8px 15px"
  },
  page: {
    color: "white",
    padding: "30px"
  }
};

export default App;