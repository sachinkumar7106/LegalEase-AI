import pdfParse from 'pdf-parse-new';
import { analyzeLegalDoc } from '../aiService.js';
import Document from '../models/Document.js';
import { mockDocuments } from '../config/mockDB.js';

export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded or invalid file format. Please upload a PDF.',
      });
    }

    let extractedText = '';

    try {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text.replace(/\n\s*\n/g, '\n\n').trim();

      if (!extractedText || extractedText.length < 5) {
        return res.status(400).json({
          error: 'Could not extract sufficient text from this PDF. It may be scanned or empty.',
        });
      }
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);

      return res.status(400).json({
        error: 'Failed to read the PDF. Please ensure it is a valid text-based PDF.',
      });
    }

    let aiAnalysis;

    try {
      aiAnalysis = await analyzeLegalDoc(extractedText);
    } catch (err) {
      console.warn('AI failed after retries:', err.message);

      aiAnalysis = {
        document_overview: 'AI analysis is temporarily unavailable due to high demand. Please try again later.',
        clause_tags: [],
        important_clauses: [],
        risk_summary: [],
        suggestions: [],
      };
    }

    const clauseTags = Array.isArray(aiAnalysis.clause_tags) ? aiAnalysis.clause_tags : [];
    const importantClauses = Array.isArray(aiAnalysis.important_clauses) ? aiAnalysis.important_clauses : [];
    const riskSummary = Array.isArray(aiAnalysis.risk_summary) ? aiAnalysis.risk_summary : [];
    const suggestions = Array.isArray(aiAnalysis.suggestions) ? aiAnalysis.suggestions : [];
    const overview = aiAnalysis.document_overview || 'No summary available.';

    let savedDocument;
    if (global.useMockDB) {
      savedDocument = {
        _id: Date.now().toString(),
        title: req.file.originalname,
        originalText: extractedText,
        summary: overview,
        risks: riskSummary.map((risk) => `${risk.level}: ${risk.text}`),
        clauses: clauseTags,
        document_overview: overview,
        clause_tags: clauseTags,
        important_clauses: importantClauses,
        risk_summary: riskSummary,
        suggestions,
        createdAt: new Date(),
      };
      mockDocuments.push(savedDocument);
    } else {
      savedDocument = await Document.create({
        title: req.file.originalname,
        originalText: extractedText,
        summary: overview,
        risks: riskSummary.map((risk) => `${risk.level}: ${risk.text}`),
        clauses: clauseTags,
        document_overview: overview,
        clause_tags: clauseTags,
        important_clauses: importantClauses,
        risk_summary: riskSummary,
        suggestions,
      });
    }

    return res.status(200).json({
      message: 'Document processed successfully.',
      document: {
        id: savedDocument._id,
        title: savedDocument.title,
        createdAt: savedDocument.createdAt,
      },
      analysis: {
        document_overview: overview,
        clause_tags: clauseTags,
        important_clauses: importantClauses,
        risk_summary: riskSummary,
        suggestions,
      },
    });
  } catch (error) {
    console.error('Document processing error:', error);

    return res.status(500).json({
      error: error.message || 'An unexpected error occurred.',
    });
  }
};
