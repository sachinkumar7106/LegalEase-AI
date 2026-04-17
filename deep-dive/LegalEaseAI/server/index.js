import './config/loadEnv.js';

import express from 'express';
import cors from 'cors';

import { analyzeLegalDoc, chatWithAI } from './aiService.js';
import upload from './middlewares/upload.js';
import requireAuth from './middlewares/requireAuth.js';
import { analyzeDocument } from './controllers/documentController.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import caseRoutes from './routes/caseRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected');

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    app.use('/auth', authRoutes);
    app.use('/cases', caseRoutes);
    app.use('/chat-history', chatRoutes);

    app.post('/analyze', requireAuth, async (req, res) => {
      try {
        const { text } = req.body;

        if (!text) {
          return res.status(400).json({ error: 'Text is required' });
        }

        const result = await analyzeLegalDoc(text);
        return res.json(result);
      } catch (error) {
        console.error('Analyze error:', error.message);
        return res.status(503).json({ error: error.message || 'AI processing failed' });
      }
    });

    app.post('/chat', requireAuth, async (req, res) => {
      try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
          return res.status(400).json({ error: 'Messages array is required' });
        }

        const reply = await chatWithAI(messages);
        return res.json({ text: reply });
      } catch (error) {
        console.error('Chat error:', error.message);
        return res.status(503).json({ error: error.message || 'AI chat failed' });
      }
    });

    app.post('/analyze-document', requireAuth, upload.single('document'), analyzeDocument);

    app.use((err, req, res, _next) => {
      console.error('Request error:', err.message);
      return res.status(400).json({ error: err.message });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
