import { Upload } from 'lucide-react'

import { useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import type { S3DetailSectionProps } from '@/types/aws-services/s3/bucket-detail'

interface HeaderSectionProps extends S3DetailSectionProps {
  onUpload: () => void
}

export const HeaderSection = ({
  control,
  config,
  onUpload,
}: HeaderSectionProps) => {
  const currentPath = useWatch({ control, name: 'currentPath' })

  if (!config.header) return null

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold">{currentPath}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          버킷의 객체를 관리하세요
        </p>
      </div>
      <Button onClick={onUpload}>
        <Upload className="mr-2 h-4 w-4" />
        업로드
      </Button>
    </div>
  )
}
