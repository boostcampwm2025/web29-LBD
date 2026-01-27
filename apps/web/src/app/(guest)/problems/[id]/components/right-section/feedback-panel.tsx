'use client'

import { FeedbackDetailCard } from '../../../components/feedback-detail-card'

import { useProblemForm } from '@/contexts/problem-form-context'

export function FeedbackPanel() {
  const { feedback } = useProblemForm()

  if (feedback.length === 0) return null

  return <FeedbackDetailCard feedback={feedback} />
}
