# Base stage
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Dependencies stage
FROM base AS deps

# Copy web package.json
COPY apps/web/package.json ./apps/web/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build

# Copy web package.json
COPY apps/web/package.json ./apps/web/

# Install all dependencies (needed for build)
RUN pnpm install --frozen-lockfile

# Copy web source code
COPY apps/web ./apps/web

WORKDIR /app/apps/web

# Build the Next.js application
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy web package.json
COPY apps/web/package.json ./apps/web/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from build stage
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/next.config.ts ./apps/web/next.config.ts

WORKDIR /app/apps/web

# Expose port (Next.js default)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start Next.js in production mode
CMD ["pnpm", "start"]
