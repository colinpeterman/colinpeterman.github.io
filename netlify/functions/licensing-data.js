const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  header.split(';').forEach(c => {
    const [k, ...v] = c.trim().split('=');
    if (k) cookies[k.trim()] = decodeURIComponent(v.join('='));
  });
  return cookies;
}

function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const dot = token.indexOf('.');
  if (dot === -1) return false;
  const value = token.slice(0, dot);
  const sig   = token.slice(dot + 1);
  if (value !== 'pp_access') return false;
  const expected = crypto.createHmac('sha256', secret).update(value).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  const secret = process.env.COOKIE_SECRET;

  const cookies = parseCookies(event.headers.cookie);
  const token   = cookies['pp_lic'];

  if (!verifyToken(token, secret)) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Try a few paths — works both in netlify dev and production Lambda
  const candidates = [
    path.join(__dirname, '../../data/licensing.json'),   // local dev
    path.join(__dirname, 'data/licensing.json'),          // included_files bundle
    path.join(process.cwd(), 'data/licensing.json'),      // fallback
  ];

  for (const filePath of candidates) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data,
      };
    } catch {
      // try next path
    }
  }

  return { statusCode: 500, body: 'Could not read licensing data' };
};
