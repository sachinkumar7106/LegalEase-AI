const Home = () => {
  return (
    <div style={styles.container}>
      
      {/* Section 1 - Upload */}
      <div style={styles.card}>
        <h3>📄 Upload Document</h3>
        <textarea placeholder="Paste legal document..." style={styles.textarea} />
        <button style={styles.button}>Analyze</button>
      </div>

      {/* Section 2 - AI Output */}
      <div style={styles.card}>
        <h3>🤖 AI Output</h3>
        <p>AI response will appear here...</p>
      </div>

      {/* Section 3 - Gemini Tips */}
      <div style={styles.card}>
        <h3>💡 Gemini Tips</h3>
        <ul>
          <li>Check clauses carefully</li>
          <li>Verify legal terms</li>
          <li>Understand obligations</li>
        </ul>
      </div>

    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    padding: "40px",
  },
  card: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    color: "white",
    minHeight: "300px",
  },
  textarea: {
    width: "100%",
    height: "150px",
    marginTop: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "8px 15px",
  },
};

export default Home;