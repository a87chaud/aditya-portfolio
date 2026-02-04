# -------------------------------
# STAGE 1: Builder
# -------------------------------
FROM node:22.16.0-alpine AS builder

# Set working directory
WORKDIR /app

# Skip Prisma downloads during install (we'll generate manually)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# 1. Copy package files and Prisma schema first for caching
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# 2. Install ALL dependencies (including dev)
RUN npm ci

# 3. Copy the rest of the source
COPY . .

# 4. Generate Prisma client (offline, includes binaries)
RUN npx prisma generate

# 5. Build your Nest app
RUN npm run build

# -------------------------------
# STAGE 2: Production
# -------------------------------
FROM node:22.16.0-alpine

WORKDIR /app

# Skip Prisma postinstall at runtime
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
# Point Prisma to the prebuilt engine binary
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node

# 1. Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# 2. Install only production dependencies
RUN npm ci --omit=dev

# 3. Copy compiled Nest app from builder
COPY --from=builder /app/dist ./dist

# 4. Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose port
EXPOSE 3000

# 5. Run migrations and start app
# CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma --config ./prisma.config.ts && node dist/src/main.js"]
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma --config ./prisma.config.ts && npx prisma db seed && node dist/src/main.js"]