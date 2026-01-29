import { FeedbackDetail } from '@/types/feedback.type'
import { FinalSubmitConfig } from '@/types/submitConfig.types'

export interface IResponse {
  result: 'PASS' | 'FAIL'
  feedback: FeedbackDetail[]
}

// 문제 제출
export async function submitProblemSolution(
  problemId: string,
  submitConfig: FinalSubmitConfig,
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  }

  const res = await fetch(`${baseUrl}/api/problems/${problemId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submitConfig),
  })

  if (!res.ok) {
    throw new Error('문제 제출 실패')
  }
  const data = (await res.json()) as IResponse

  return data
}
