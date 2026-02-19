# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl openssl-dev
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl openssl-dev
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure public directory exists
RUN mkdir -p public

# Generate Prisma Client
RUN node_modules/.bin/prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl openssl-dev
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public (may be empty but must exist)
RUN mkdir -p public
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
