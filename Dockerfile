# Run:
#   docker run -d --name custardbot --restart unless-stopped \
#     -e TOKEN=your_discord_token \
#     -e CLIENT_ID=your_client_id \
#     -e GUILD_ID=your_guild_id \
#     succulentgoose/custardbot:latest

## ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

## ---- Production stage ----
FROM node:20-alpine

# Install OS dependencies required by Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Install Playwright browser binaries
RUN npx playwright install chromium

COPY --from=build /usr/src/app/dist ./dist

# Tell Playwright to use the system Chromium installed via apk
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
