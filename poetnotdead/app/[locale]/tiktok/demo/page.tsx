'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface TikTokUser {
  display_name?: string;
  username?: string;
  avatar_url?: string;
}

interface TikTokVideo {
  id: string;
  title?: string;
  cover_image_url?: string;
}

function TikTokDemoContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const sessionId = searchParams.get('session');
  const [user, setUser] = useState<TikTokUser | null>(null);
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setLoading(true);
      fetch('/api/tiktok/session?id=' + sessionId)
        .then(r => r.json())
        .then(data => {
          if (data.user) setUser(data.user);
          if (data.videos) setVideos(data.videos);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>🎵 TikTok Integration Demo</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Poet Not Dead — TikTok Login Kit + video.list
      </p>

      {error && (
        <div style={{ background: '#fee', padding: 16, borderRadius: 8, marginBottom: 24, color: '#c00' }}>
          ❌ Auth error: {decodeURIComponent(error)}
        </div>
      )}

      {loading && <p>Loading TikTok data...</p>}

      {!user && !error && !loading && (
        <a
          href="/api/tiktok/login"
          style={{
            display: 'inline-block',
            background: '#000',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          🔑 Login with TikTok
        </a>
      )}

      {user && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            {user.avatar_url && (
              <img src={user.avatar_url} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{user.display_name || '—'}</div>
              {user.username && <div style={{ color: '#666' }}>@{user.username}</div>}
            </div>
          </div>

          <h2 style={{ fontSize: 20, marginBottom: 16 }}>📹 Your Videos</h2>
          {videos.length === 0 && <p style={{ color: '#999' }}>No videos found.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {videos.map((v) => (
              <div key={v.id} style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                {v.cover_image_url && (
                  <img src={v.cover_image_url} alt={v.title} style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '8px 12px', fontSize: 13 }}>{v.title || 'Untitled'}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <a href="/api/tiktok/login" style={{ color: '#666', fontSize: 14 }}>↩ Login with another account</a>
          </div>
        </>
      )}
    </main>
  );
}

export default function TikTokDemoPage() {
  return (
    <Suspense fallback={<main style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>Loading...</main>}>
      <TikTokDemoContent />
    </Suspense>
  );
}
