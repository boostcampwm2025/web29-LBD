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

  // 서비스별 리소스 카운트 문자열 생성
  const resourceSummary = useMemo(() => {
    const summaries: string[] = []
    if (submitConfig.s3?.length) {
      summaries.push(`S3: ${submitConfig.s3.length}개`)
    }
    // 향후 다른 서비스 추가 시 확장
    return summaries.join(', ')
  }, [submitConfig])

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        onClick={submitProblem}
        disabled={isSubmitting || totalResourceCount === 0}
      >
        {isSubmitting
          ? '제출 중...'
          : `제출하기 (${totalResourceCount}개 리소스)`}
      </Button>
      {totalResourceCount > 0 && (
        <p className="text-muted-foreground text-center text-sm">
          {resourceSummary}
        </p>
      )}
      {totalResourceCount === 0 && (
        <p className="text-muted-foreground text-center text-sm">
          리소스를 추가해주세요
        </p>
      )}
    </div>
  )
}
