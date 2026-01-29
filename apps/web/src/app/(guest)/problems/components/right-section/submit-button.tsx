'use client'

import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'

export function SubmitButton() {
  const { isSubmitting, submitProblem, submitConfig } = useProblemForm()

  // 전체 리소스 카운트 계산
  const totalResourceCount = useMemo(() => {
    return Object.values(submitConfig).reduce(
      (total, items) => total + (items?.length || 0),
      0,
    )
  }, [submitConfig])

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        onClick={submitProblem}
        disabled={isSubmitting || totalResourceCount === 0}
      >
        {isSubmitting ? '제출 중...' : `제출하기`}
      </Button>
    </div>
  )
}
