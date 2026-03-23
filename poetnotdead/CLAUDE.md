# CLAUDE.md — poetnotdead.com

## Stack
Next.js 14 (App Router) + next-intl (ru, en). PM2 "poetnotdead" port 3001. Nginx reverse proxy. SSL Let's Encrypt (exp May 2026).

## Dev Commands
```bash
cd /var/www/poetnotdead
npm run build && pm2 restart poetnotdead
curl -s -o /dev/null -w "%{http_code}" https://poetnotdead.com
pm2 logs poetnotdead --lines 20
```

## Structure
- `src/app/[locale]/` — pages
- `src/components/` — React components
- `messages/` — i18n (ru.json, en.json)
- `public/` — static assets

## Rules
- ALWAYS build before PM2 restart
- Test both locales after content changes
- Backup nginx config before changes
- IndexNow after new pages: `node /root/.openclaw/workspace/scripts/indexnow-submit.mjs`
