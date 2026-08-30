/**
 * Robust Answer Key Fetcher Utility
 * Handles full-stack Express API, Vercel Serverless Functions, and client-side CORS proxy fallbacks.
 */

export interface FetchResult {
  html: string;
  source: 'api' | 'corsproxy' | 'allorigins' | 'codetabs';
}

/**
 * Safely parse JSON or extract text from a fetch Response without throwing uncaught SyntaxErrors
 */
async function parseJsonResponse(res: Response): Promise<{ success: boolean; data?: any; text?: string; status: number }> {
  const status = res.status;
  const contentType = res.headers.get('content-type') || '';
  const rawText = await res.text();

  if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
    try {
      const data = JSON.parse(rawText);
      return { success: res.ok, data, text: rawText, status };
    } catch {
      // Not valid JSON despite header
      return { success: false, text: rawText, status };
    }
  }

  return { success: res.ok, text: rawText, status };
}

/**
 * Main URL fetcher with server API + multi-tier client-side CORS proxy fallbacks
 */
export async function fetchDigiALMResponseHtml(targetUrl: string): Promise<FetchResult> {
  const cleanUrl = targetUrl.trim().replace(/#.*$/, '');
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    throw new Error('Please enter a valid URL starting with http:// or https://');
  }

  const errors: string[] = [];

  // Tier 1: Try the internal backend / serverless endpoint (/api/parse-url)
  try {
    const res = await fetch('/api/parse-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanUrl }),
    });

    const parsed = await parseJsonResponse(res);

    if (parsed.success && parsed.data?.html && parsed.data.html.length > 500) {
      return { html: parsed.data.html, source: 'api' };
    }

    if (parsed.data?.error) {
      errors.push(`Backend API: ${parsed.data.error}`);
    } else if (res.status === 404) {
      errors.push('Backend API endpoint not found on this host.');
    } else if (parsed.text && parsed.text.length < 500) {
      errors.push(`Server returned status ${res.status}`);
    }
  } catch (err: any) {
    errors.push(`Backend API error: ${err.message}`);
  }

  // Tier 2: Fallback to AllOrigins Raw CORS Proxy
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const html = await res.text();
      if (html && html.length > 500 && (html.includes('menu-tbl') || html.includes('question') || html.includes('touchstone') || html.includes('digialm'))) {
        return { html, source: 'allorigins' };
      }
    }
  } catch (err: any) {
    errors.push(`AllOrigins proxy: ${err.message}`);
  }

  // Tier 3: Fallback to Corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const html = await res.text();
      if (html && html.length > 500 && (html.includes('menu-tbl') || html.includes('question') || html.includes('touchstone') || html.includes('digialm'))) {
        return { html, source: 'corsproxy' };
      }
    }
  } catch (err: any) {
    errors.push(`Corsproxy: ${err.message}`);
  }

  // Tier 4: Fallback to CodeTabs CORS Proxy
  try {
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const html = await res.text();
      if (html && html.length > 500 && (html.includes('menu-tbl') || html.includes('question') || html.includes('touchstone') || html.includes('digialm'))) {
        return { html, source: 'codetabs' };
      }
    }
  } catch (err: any) {
    errors.push(`CodeTabs proxy: ${err.message}`);
  }

  // If all automated fetches fail, provide an actionable and friendly message
  throw new Error(
    'Unable to fetch the answer key URL automatically (the CDN link may have expired or is blocked). ' +
    'Please save the answer key webpage as an HTML file (Ctrl+S) and use the "Upload HTML File" or "Paste HTML Source" tab.'
  );
}
