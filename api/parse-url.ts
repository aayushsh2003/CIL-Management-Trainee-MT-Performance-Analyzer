import https from 'https';
import http from 'http';

// Helper to fetch remote URL with realistic browser headers
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
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Upgrade-Insecure-Requests': '1',
        },
      };

      const req = client.request(options, (res) => {
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
        res.on('data', (chunk) => (data += chunk));
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

export default async function handler(req: any, res: any) {
  // Enable CORS headers
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
    const url = body?.url;

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Valid URL is required' });
      return;
    }

    const cleanUrl = url.trim().replace(/#.*$/, '');
    const html = await fetchRemoteUrl(cleanUrl);

    if (!html || html.length < 500) {
      res.status(422).json({ error: 'The fetched page did not contain valid assessment response data.' });
      return;
    }

    res.status(200).json({
      success: true,
      html,
      sourceUrl: cleanUrl,
      size: html.length,
    });
  } catch (error: any) {
    console.error('[Vercel API /api/parse-url error]:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch the DigiALM assessment URL.',
    });
  }
}
