import { NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI!;

  // PKCE
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  const state = randomBytes(16).toString('hex');

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: 'user.info.basic,video.list',
    response_type: 'code',
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params}`;

  const response = NextResponse.redirect(authUrl);
  response.cookies.set('tt_code_verifier', codeVerifier, { httpOnly: true, maxAge: 600 });
  response.cookies.set('tt_state', state, { httpOnly: true, maxAge: 600 });

  return response;
}
