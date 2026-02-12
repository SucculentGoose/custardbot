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
1. Build and run:

```bash
docker build -t custardbot:latest .
docker run -d --name custardbot -e TOKEN=$TOKEN -e CLIENT_ID=$CLIENT_ID -e GUILD_ID=$GUILD_ID custardbot:latest
```

2. docker-compose:

```bash
docker compose up -d --build
```

Notes & Tips
- Keep `.env` out of version control; use environment variables or a secrets manager for tokens.
- If you run on ARM (Raspberry Pi), use a compatible base image (node:20-bullseye-slim or arm images) or build on the target.
- If your bot requires headless browsers (playwright), install additional packages in the Dockerfile (dependencies for chromium) or use playwright's docker images.

If you tell me which method you prefer (pm2/systemd/Docker) and your server details (x86 vs ARM, uses Playwright?), I can provide a tailored ready-to-run service file or Dockerfile with playwright support.
