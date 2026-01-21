import { ProblemType } from '@/types/problem.type'

// 문제 유형에 따른 문제 목록 조회
export async function getProblemListByType(type: ProblemType) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  }

  const res = await fetch(`${baseUrl}/api/problems?type=${type}`, {
    cache: 'force-cache',
  })

  if (!res.ok) {
    throw new Error('문제 목록 조회 실패')
  }

  return res.json()
}

// 문제 제출
export async function submitProblemSolution(problemId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  }

  const res = await fetch(`${baseUrl}/api/problems/${problemId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('문제 제출 실패')
  }

  return res.json()
}
