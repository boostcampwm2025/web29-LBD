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

ENV CI=true

# [수정] 빌드에 필요한 모든 소스 코드를 루트 기준으로 복사합니다.
# 터보팩은 프로젝트 전체 구조를 참조해야 하므로 앱 코드만 복사하면 안 됩니다.
COPY . .

# 의존성 설치 (루트에서 한 번에 실행)
RUN pnpm install --frozen-lockfile

# [수정] 빌드 실행
# apps/web으로 이동하지 않고 루트에서 필터를 써서 실행하는 것이 경로 오류를 줄입니다.
RUN pnpm --filter web build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# [중요] 경로 복사 - standalone은 모노레포 구조를 그대로 가지고 나옵니다.
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# [중요] 실행 파일 위치 확인
CMD ["node", "apps/web/server.js"]