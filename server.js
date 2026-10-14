import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HERMES_BACKEND_URL = process.env.HERMES_BACKEND_URL || 'http://localhost:20128/v1';
const HERMES_API_KEY = process.env.HERMES_API_KEY || 'sk-091f0b09527143bb-182sc1-2aca3a57';

app.use(express.json({ limit: '10mb' }));

// Hermes API Reverse Proxy for production & Railway
app.use('/api/hermes', async (req, res) => {
  const targetUrl = `${HERMES_BACKEND_URL}${req.url}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HERMES_API_KEY}`
    };

    const fetchOptions = {
      method: req.method,
      headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const upstreamRes = await fetch(targetUrl, fetchOptions);
    const data = await upstreamRes.text();

    res.status(upstreamRes.status);
    upstreamRes.headers.forEach((val, key) => {
      if (key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, val);
      }
    });
    res.send(data);
  } catch (err) {
    console.warn(`[Hermes Proxy] Error reaching upstream ${targetUrl}:`, err.message);
    res.status(502).json({
      error: 'Hermes backend unreachable from server',
      details: err.message,
      target: targetUrl
    });
  }
});

// Serve frontend build from dist/
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback for any client route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Kaycee Studio running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Hermes proxy pointing to: ${HERMES_BACKEND_URL}`);
});
