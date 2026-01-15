import type { S3UploadSectionProps } from '../types'

import { Button } from '@/components/ui/button'

interface ActionButtonsSectionProps extends S3UploadSectionProps {
  onPrev: () => void
  onNext: () => void
}

export const ActionButtonsSection = ({
  config,
  onPrev,
  onNext,
}: ActionButtonsSectionProps) => {
  if (!config.actionButtons) return null

  return (
    <div className="flex justify-between gap-3 pt-6">
      <Button variant="outline" onClick={onPrev}>
        이전
      </Button>
      <Button onClick={onNext}>다음단계</Button>
    </div>
  )
}
