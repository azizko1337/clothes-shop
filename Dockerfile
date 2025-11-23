FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN apk add --no-cache libc6-compat
RUN npm ci

FROM base AS dev
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set dummy DATABASE_URL for build time
ENV DATABASE_URL="file:/app/prisma/dev.db"
# Generate prisma client
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma generate && npm run dev"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set dummy DATABASE_URL for build time
ENV DATABASE_URL="file:/app/prisma/dev.db"
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

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

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
