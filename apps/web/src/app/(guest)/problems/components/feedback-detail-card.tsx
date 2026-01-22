'use client'

import { SparklesIcon } from 'lucide-react'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface FeedbackDetail {
  service: string
  field: string
  message: string
}

export const FeedbackDetailCard = ({
  feedback,
}: {
  feedback: FeedbackDetail[]
}) => {
  const [visible, setVisible] = useState(false)

  const messages = feedback.map((item) => item.message)

  return (
    <Card className="border-primary bg-primary-foreground relative border-2">
      <div className={cn(!visible && 'pointer-events-none blur-md')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon fill="#3979ef" className="text-primary h-5 w-5" />
            상세 피드백 확인하기
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-2">
          <ul className="list-disc pl-4 text-sm leading-6">
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </CardContent>
      </div>

      {!visible && (
        <div
          className={cn(
            'absolute inset-0 z-10',
            'flex items-center justify-center gap-2',
            'cursor-pointer',
          )}
          onClick={() => setVisible(true)}
        >
          <SparklesIcon fill="#3979ef" className="text-primary h-8 w-8" />
          <p className="text-xl font-semibold">
            여기를 눌러 상세 피드백을 확인할 수 있어요
          </p>
        </div>
      )}
    </Card>
  )
}
