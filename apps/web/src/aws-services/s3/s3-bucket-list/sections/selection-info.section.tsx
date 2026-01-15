import type { S3ListWithSetValueSectionProps } from '../types'

import { useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'

export const SelectionInfoSection = ({
  control,
  config,
  setValue,
}: S3ListWithSetValueSectionProps) => {
  const selectedBuckets = useWatch({ control, name: 'selectedBuckets' })

  if (!config.selectionInfo) return null
  if (selectedBuckets.length === 0) return null

  const handleClearSelection = () => {
    setValue('selectedBuckets', [])
  }

  return (
    <div className="bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-2">
      <p className="text-sm">
        <span className="font-semibold">{selectedBuckets.length}</span>개 선택됨
      </p>
      <Button variant="outline" size="sm" onClick={handleClearSelection}>
        선택 해제
      </Button>
    </div>
  )
}
