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
# AD-10: placeholder, ikke en ekte tilkobling — prisma generate trenger bare
# en ikke-tom streng, og slår ikke opp en reell database.
ARG DATABASE_URL=postgresql://unused:unused@localhost:5432/unused
ENV DATABASE_URL=$DATABASE_URL
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

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# AD-11: migrering kjører automatisk ved oppstart, før appen starter.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
