export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }

  return process.env.INTERNAL_API_URL || 'http://localhost:3001'
}
