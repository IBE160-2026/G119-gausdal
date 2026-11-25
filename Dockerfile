# syntax=docker/dockerfile:1

# AD-11: Dette bildet skal kunne starte appen med docker compose up alene.
# Node 22 LTS, jf. ryggradens Stack.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# AD-10: placeholder, ikke en ekte tilkobling — prisma generate og next
# build trenger bare ikke-tomme strenger, og slår ikke opp en reell
# database eller bruker hemmeligheten til noe under selve bygget.
ARG DATABASE_URL=postgresql://unused:unused@localhost:5432/unused
ARG BETTER_AUTH_SECRET=byggetid-placeholder-ikke-en-ekte-hemmelighet-00
ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
# prisma/seed.ts (kjørt med tsx, se CMD under) importerer src/app/db.ts og
# src/app/config.ts som TypeScript-kildefiler — de må være med i runtime-laget.
COPY --from=build /app/src ./src

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# AD-11: migrering og seed kjører automatisk ved oppstart, før appen
# starter. Seed er idempotent (se prisma/seed.ts) — trygt på hver
# omstart, ikke bare første gang (app-tjenesten har restart: unless-stopped).
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
