# Base stage
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development

# Copy server package.json
COPY apps/server/package.json ./apps/server/

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy server source code
COPY apps/server ./apps/server

WORKDIR /app/apps/server

# Expose port
EXPOSE 3000

# Start in dev mode with hot-reload
# CMD ["pnpm", "start:dev"]

# Build stage
FROM base AS build

# Copy server package.json
COPY apps/server/package.json ./apps/server/

# Install all dependencies (needed for build)
RUN pnpm install --frozen-lockfile

# Copy server source code
COPY apps/server ./apps/server

WORKDIR /app/apps/server

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy server package.json
COPY apps/server/package.json ./apps/server/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy built files from build stage
COPY --from=build /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

# Expose port
EXPOSE 3000

# Start in production mode
CMD ["pnpm", "start:prod"]
