import path from 'node:path'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  // Docker 빌드 시에만 outputFileTracingRoot 적용하여 모노레포 구조 유지
  // 로컬 개발 환경에서는 제외하여 tailwindcss 해석 문제 방지
  ...(process.env.DOCKER_BUILD === 'true' && {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }),
}

export default nextConfig
