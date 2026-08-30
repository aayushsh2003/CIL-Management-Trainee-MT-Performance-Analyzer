import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { questionText, options, rightOption, chosenOption, subject } = body || {};

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
      contents: prompt,
    });

    res.status(200).json({ explanation: response.text });
  } catch (err: any) {
    console.error('[Vercel API /api/explain-question error]:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate explanation' });
  }
}
