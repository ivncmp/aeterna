# PWA & Deploy

## PWA (Progressive Web App)

So it can be installed on mobile as a native-like app from the browser.

### Requirements
- `manifest.json` with name, icons (192x192, 512x512), theme_color (#09090B), background_color
- Basic service worker for static asset caching
- Splash screen
- `vite-plugin-pwa` for automatic generation

### Notifications (optional, P3)
- Remind to log sleep/mood at end of day
- Notification when entering a new metabolic zone
- Requires HTTPS and user permission

## Production Deploy

### docker-compose.prod.yml

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./frontend/dist:/usr/share/nginx/html
      - ./certbot/conf:/etc/letsencrypt
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://aeterna:${DB_PASSWORD}@db:5432/aeterna
      - JWT_SECRET=${JWT_SECRET}
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=aeterna
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=aeterna
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### SSL
- Let's Encrypt with certbot
- Auto-renewal via cron

### Backups
- Automatic daily `pg_dump` via cron
- 30-day retention

### Access
- Subdomain pointing to Ivan's server
- Not publicly listed, only accessible via direct URL
- JWT auth protects each user's data
