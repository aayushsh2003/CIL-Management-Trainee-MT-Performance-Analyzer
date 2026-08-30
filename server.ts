import express from 'express';
import path from 'path';
import https from 'https';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to fetch remote URL with browser-like headers
function fetchRemoteUrl(targetUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      };

      const req = client.request(options, (res) => {
        // Handle redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, targetUrl).toString();
          fetchRemoteUrl(redirectUrl).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode && res.statusCode !== 200) {
          reject(new Error(`Failed to fetch URL: HTTP ${res.statusCode} ${res.statusMessage || ''}`));
          return;
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', (err) => reject(err));
      req.setTimeout(25000, () => {
        req.destroy();
        reject(new Error('Request timed out after 25 seconds'));
      });
      req.end();
    } catch (e: any) {
      reject(new Error(`Invalid URL format: ${e.message}`));
    }
  });
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Proxy fetch DigiALM URL
app.post('/api/parse-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Valid URL is required' });
      return;
    }

    const cleanUrl = url.trim().replace(/#.*$/, '');
    console.log(`[API] Fetching assessment key: ${cleanUrl}`);

    const html = await fetchRemoteUrl(cleanUrl);
    
    if (!html || html.length < 500) {
      res.status(422).json({ error: 'The fetched page did not contain valid assessment response data.' });
      return;
    }

    res.json({
      success: true,
      html,
      sourceUrl: cleanUrl,
      size: html.length
    });
  } catch (error: any) {
    console.error('[API Error /api/parse-url]:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch the DigiALM assessment URL. Please ensure the link is active or paste the HTML source.'
    });
  }
});

// 3. AI Question Insight / Concept Explainer
app.post('/api/explain-question', async (req, res) => {
  try {
    const { questionText, options, rightOption, chosenOption, subject } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert exam tutor for Coal India Limited (CIL MT) and Indian Engineering/Competitive exams.
Subject: ${subject || 'Engineering / General Aptitude'}
Question: ${questionText}
Options: ${JSON.stringify(options)}
Correct Answer: Option ${rightOption}
Student Chosen Answer: ${chosenOption ? `Option ${chosenOption}` : 'Unattempted'}

Provide a clear, high-yield explanation containing:
1. Key Concept & Theory in 2-3 concise sentences.
2. Step-by-step solution / reasoning why Option ${rightOption} is correct.
3. Why the other options or the student's chosen option is incorrect (if applicable).
4. Quick revision tip / memory trick for CIL MT exam.

Keep the formatting clean with markdown bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ explanation: response.text });
  } catch (err: any) {
    console.error('[AI Explanation Error]:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate explanation' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIL MT Analyzer Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
