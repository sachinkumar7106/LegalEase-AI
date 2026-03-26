export async function analyzeLegalDoc(text) {
  return {
    summary: "This is a simplified explanation.",
    clauses: [
      {
        text: "Employer can terminate anytime",
        risk: "HIGH",
        reason: "No job security",
        suggestion: "Ask for notice period"
      }
    ]
  };
}