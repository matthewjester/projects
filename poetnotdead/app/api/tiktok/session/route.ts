import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get('id');
  if (!sessionId || !/^[a-z0-9]+$/.test(sessionId)) {
    return NextResponse.json({ error: 'invalid session' }, { status: 400 });
  }
  const file = join('/tmp/tiktok-sessions', sessionId + '.json');
  try {
    const data = JSON.parse(await readFile(file, 'utf-8'));
    await unlink(file).catch(() => {});
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'session not found' }, { status: 404 });
  }
}
