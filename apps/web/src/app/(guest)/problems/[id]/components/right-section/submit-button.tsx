'use client'

import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'

export function SubmitButton() {
  const { form, isSubmitting, submitProblem } = useProblemForm()

  return (
    <Button
      className="w-full"
      onClick={form.handleSubmit(submitProblem)}
      disabled={isSubmitting}
    >
      {isSubmitting ? '제출 중...' : '제출하기'}
    </Button>
  )
}
