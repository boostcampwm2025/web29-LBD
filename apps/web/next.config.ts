import path from 'node:path'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

export default nextConfig
