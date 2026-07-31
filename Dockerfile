# Stage 1: Install dependencies
FROM node:22.11.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps --ignore-scripts

# Stage 2: Build the application
FROM node:22.11.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:22.11.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files for runtime (standalone output)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:nodejs /app/.next/standalone ./
COPY --from=builder --chown=node:nodejs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]