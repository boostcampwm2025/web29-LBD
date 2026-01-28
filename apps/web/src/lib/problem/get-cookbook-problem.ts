interface UnitProblem {
  id: number
  title: string
  orderNumber: number
}

interface CookbookProblemData {
  title: string
  description: string
  descDetail: string
  tags: string[]
  units: UnitProblem[]
}

export async function getCookbookProblemDataById(
  id: string,
): Promise<CookbookProblemData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  }

  const res = await fetch(`${baseUrl}/api/cookbooks/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('쿡북 문제 상세 조회 실패')
  }

  const response = await res.json()

  return {
    title: response.title ?? '문제',
    description: response.description ?? '',
    descDetail: response.descDetail,
    tags: response.tags ?? [],
    units: response.problems ?? [],
  }
}
