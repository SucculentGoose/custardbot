This file documents recommended ways to run the bot on a Linux home server.

Options covered:
- Using pm2 (recommended if you already use it)
- Using systemd (native service manager)
- Using Docker / docker-compose (portable and reproducible)

Prerequisites
- Node.js 18+ or 20 (LTS recommended)
- Git (optional)
- PM2 (if using pm2)
- Docker & docker-compose (if using Docker)

PM2 (quick)
1. Build the project (if using TypeScript):

```bash
npm install
npm run build
```

2. Start with pm2 using the ecosystem file:

```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

3. Logs:

```bash
pm2 logs custardbot
```

systemd (reliable, no external process manager)
1. Create a systemd unit file at `/etc/systemd/system/custardbot.service`:

```ini
[Unit]
Description=Custardbot Discord Bot
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/your/repo
ExecStart=/usr/bin/node /path/to/your/repo/dist/index.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=TOKEN=your_token_here

[Install]
WantedBy=multi-user.target
```

2. Reload and enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable custardbot
sudo systemctl start custardbot
sudo journalctl -u custardbot -f
```

Docker (portable)

1) Lightweight Node (no Playwright)

Build and run a minimal image:

```bash
docker build -t custardbot:latest .
docker run -d \
  --name custardbot \
  -e TOKEN="$TOKEN" \
  -e CLIENT_ID="$CLIENT_ID" \
  -e GUILD_ID="$GUILD_ID" \
  -v $(pwd):/usr/src/app:ro \
  custardbot:latest
```

2) Playwright + x64 (recommended if you use Playwright)

Use the included Playwright Dockerfile which is based on Microsoft's Playwright image and includes browser dependencies:

```bash
docker build -f Dockerfile.playwright -t custardbot:playwright .
docker run -d \
  --name custardbot \
  -e TOKEN="$TOKEN" \
  -e CLIENT_ID="$CLIENT_ID" \
  -e GUILD_ID="$GUILD_ID" \
  -v /dev/shm:/dev/shm \
  custardbot:playwright
```

3) docker-compose (example)

```bash
docker compose up -d --build
```

Notes & Tips
- Keep `.env` out of version control; use environment variables or a secrets manager for tokens.
- On an x64 home server the Playwright image is the simplest way to ensure browser dependencies are present.
- If you prefer pm2, use the `ecosystem.config.js` file included in the repo. First build the project locally (or inside CI) and then run pm2 against `dist/index.js`.
- If you rely on Playwright, run the Playwright image or install necessary OS packages (libnss3, libatk-1.0-0, libx11-xcb1, etc.) in your base image.

If you'd like, I can produce a ready-to-run `systemd` unit or a `docker-compose.yml` tuned for Playwright (with volume mounts and shm settings). Tell me which you prefer and I'll add it.
