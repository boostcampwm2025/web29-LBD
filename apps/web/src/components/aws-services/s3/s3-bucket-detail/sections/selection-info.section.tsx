import { useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import type { S3DetailWithSetValueSectionProps } from '@/types/aws-services/s3/bucket-detail'

export const SelectionInfoSection = ({
  control,
  config,
  setValue,
}: S3DetailWithSetValueSectionProps) => {
  const selectedObjects = useWatch({ control, name: 'selectedObjects' })

  if (!config.selectionInfo) return null
  if (selectedObjects.length === 0) return null

  const handleClearSelection = () => {
    setValue('selectedObjects', [])
  }

  return (
    <div className="bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-2">
      <p className="text-sm">
        <span className="font-semibold">{selectedObjects.length}</span>개 선택됨
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleClearSelection}>
          선택 해제
        </Button>
        <Button variant="outline" size="sm">
          다운로드
        </Button>
        <Button variant="destructive" size="sm">
          삭제
        </Button>
      </div>
    </div>
  )
}
