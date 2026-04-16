import mongoose from "mongoose";

const clauseSchema = new mongoose.Schema(
  {
    text: String,
    explanation: String,
  },
  { _id: false }
);

const riskSchema = new mongoose.Schema(
  {
    level: String,
    text: String,
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema({
  title: String,
  originalText: String,

  summary: String,
  risks: [String],
  clauses: [String],
  document_overview: String,
  clause_tags: [String],
  important_clauses: [clauseSchema],
  risk_summary: [riskSchema],
  suggestions: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Document", documentSchema);
