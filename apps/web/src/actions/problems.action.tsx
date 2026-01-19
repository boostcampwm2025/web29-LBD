import { ProblemType } from '@/types/problem.type'

export async function getProblemListByType(type: ProblemType) {
  if (!type) throw new Error('문제 유형 정보가 없습니다.')

  // TODO: 백엔드 API 경로 수정 필요
  const url = `/api/problems?type=${type}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('문제 목록 조회 실패')
  }

  const jsonResponse = await response.json()
  return jsonResponse
}
