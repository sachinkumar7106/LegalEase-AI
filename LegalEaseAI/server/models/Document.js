import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: String,
  originalText: String,

  summary: String,
  risks: [String],
  clauses: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Document", documentSchema);