FROM node:20-alpine

WORKDIR /usr/src/app

# Install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source and built dist (for projects that already build locally)
COPY . .

# Build TypeScript if present
RUN if [ -f ./tsconfig.json ]; then npm run build; fi

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
