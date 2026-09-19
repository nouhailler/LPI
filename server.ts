import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleExplainDifferently } from './server/geminiExplain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for Explain it differently (Gemini AI layer)
app.post('/api/explain-differently', async (req, res) => {
  try {
    const result = await handleExplainDifferently(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error', isFallback: true });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// Production static file serving
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LPI Exam Prep Server running on port ${PORT}`);
});
