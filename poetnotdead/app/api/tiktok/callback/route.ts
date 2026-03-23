import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'poetnotdead.com';
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  return proto + "://" + host;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/en/tiktok/demo?error=auth_failed', getBaseUrl(req)));
  }

  const savedState = req.cookies.get('tt_state')?.value;
  const codeVerifier = req.cookies.get('tt_code_verifier')?.value;

  if (state !== savedState || !codeVerifier) {
    return NextResponse.redirect(new URL('/en/tiktok/demo?error=invalid_state', getBaseUrl(req)));
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('[TikTok] Token response:', JSON.stringify(tokenData));

    if (!tokenData.access_token) {
      const errMsg = tokenData.error_description || tokenData.error || 'token_failed';
      return NextResponse.redirect(new URL('/en/tiktok/demo?error=' + encodeURIComponent(errMsg), getBaseUrl(req)));
    }

    const accessToken = tokenData.access_token;

    // Fetch user info
    const userRes = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const userData = await userRes.json();
    console.log('[TikTok] User response:', JSON.stringify(userData));
    const user = userData.data?.user ?? {};

    // Fetch video list
    const videoRes = await fetch(
      'https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_count: 5 }),
      }
    );
    const videoData = await videoRes.json();
    console.log('[TikTok] Videos response:', JSON.stringify(videoData));
    const videos = videoData.data?.videos ?? [];

    // Save to tmp file and pass session id
    const sessionId = Math.random().toString(36).slice(2, 10);
    const tmpDir = '/tmp/tiktok-sessions';
    await mkdir(tmpDir, { recursive: true });
    await writeFile(join(tmpDir, sessionId + '.json'), JSON.stringify({ user, videos, token: accessToken }));

    const response = NextResponse.redirect(new URL('/en/tiktok/demo?session=' + sessionId, getBaseUrl(req)));
    response.cookies.delete('tt_code_verifier');
    response.cookies.delete('tt_state');
    return response;
  } catch (err: any) {
    console.error('[TikTok] Callback error:', err);
    return NextResponse.redirect(new URL('/en/tiktok/demo?error=' + encodeURIComponent(err.message || 'unknown'), getBaseUrl(req)));
  }
}
