# ==========================================
# Multi-stage Dockerfile for @t-amada/hotel-service
# Build context: repository root
# ==========================================

# Stage 1: Build stage
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /usr/src/app

# Copy root workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nest-cli.json tsconfig*.json ./

# Copy all package manifests to allow workspace resolution
COPY libs/common/package.json ./libs/common/
COPY apps/flight-service/package.json ./apps/flight-service/
COPY apps/hotel-service/package.json ./apps/hotel-service/
COPY apps/insurance-service/package.json ./apps/insurance-service/
COPY apps/transfer-service/package.json ./apps/transfer-service/

# Install full dependencies for building
RUN pnpm install --frozen-lockfile

# Copy shared libraries and the service source code
COPY libs ./libs
COPY apps/hotel-service ./apps/hotel-service

# Build common library and hotel-service
RUN pnpm --filter @t-amada/common run build && pnpm --filter @t-amada/hotel-service run build

# Stage 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NODE_PATH=/usr/src/app/apps/hotel-service/node_modules:/usr/src/app/node_modules

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Copy workspace manifests for production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY libs/common/package.json ./libs/common/
COPY apps/flight-service/package.json ./apps/flight-service/
COPY apps/hotel-service/package.json ./apps/hotel-service/
COPY apps/insurance-service/package.json ./apps/insurance-service/
COPY apps/transfer-service/package.json ./apps/transfer-service/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built shared library and compiled service artifacts
COPY --from=builder /usr/src/app/libs/common ./libs/common
COPY --from=builder /usr/src/app/apps/hotel-service/dist ./dist
COPY --from=builder /usr/src/app/apps/hotel-service/drizzle ./apps/hotel-service/drizzle

# Run as non-root user
USER node

EXPOSE 3002

CMD ["node", "dist/apps/hotel-service/src/main.js"]
