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

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=build /app/apps/web/public ./public

# Copy standalone output (includes minimal node_modules)
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# Copy static files
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port (Next.js default)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run standalone server
CMD ["node", "server.js"]
