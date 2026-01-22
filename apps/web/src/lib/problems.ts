import { ProblemType } from '@/types/problem.type'

export async function getProblemListByType(type: ProblemType) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  }

  const res = await fetch(`${baseUrl}/api/problems?type=${type}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('문제 목록 조회 실패')
  }

  return res.json()
}
