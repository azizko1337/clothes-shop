# ----------------------
# BASE
# ----------------------
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ----------------------
# DEPS
# ----------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
RUN npm ci

# ----------------------
# DEV
# ----------------------
FROM base AS dev
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fake DATABASE_URL tylko po to, żeby prisma generate się wykonało
ENV DATABASE_URL="postgresql://fake:fake@localhost:5432/fakedb"

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma generate && npm run dev"]

# ----------------------
# BUILDER
# ----------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fake DB URL – tylko aby prisma generate działało offline
ENV DATABASE_URL="postgresql://fake:fake@localhost:5432/fakedb"

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ----------------------
# RUNNER
# ----------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

RUN chown -R nextjs:nodejs /app/.next
RUN chown -R nextjs:nodejs /app/prisma
RUN chown -R nextjs:nodejs /app/src/generated

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# DATABASE_URL będzie podany wyłącznie z docker-compose
CMD ["npm", "start"]
