const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let password;
  try {
    ({ password } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: 'Bad request' };
  }

  const correctPassword = process.env.LICENSING_PASSWORD;
  const secret = process.env.COOKIE_SECRET;

  if (!correctPassword || !secret) {
    return { statusCode: 500, body: 'Server not configured — set LICENSING_PASSWORD and COOKIE_SECRET env vars in Netlify.' };
  }

  if (!password || password !== correctPassword) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Incorrect password' }),
    };
  }

  // Sign a token with HMAC so it can't be forged
  const value = 'pp_access';
  const sig = crypto.createHmac('sha256', secret).update(value).digest('hex');
  const token = `${value}.${sig}`;

  return {
    statusCode: 200,
    headers: {
      // HttpOnly = JS can't read it, SameSite=Strict = no cross-site requests
      'Set-Cookie': `pp_lic=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};
