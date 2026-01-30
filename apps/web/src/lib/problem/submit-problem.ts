import { getApiBaseUrl } from '../get-base-url'

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
  const baseUrl = getApiBaseUrl()

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
