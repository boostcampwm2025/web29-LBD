import type { S3UploadSectionProps } from '../types'
import { ChevronRight } from 'lucide-react'

import { useWatch } from 'react-hook-form'

interface BreadcrumbSectionProps extends S3UploadSectionProps {
  onBucketClick: () => void
}

export const BreadcrumbSection = ({
  control,
  config,
  onBucketClick,
}: BreadcrumbSectionProps) => {
  const bucketName = useWatch({ control, name: 'bucketName' })

  if (!config.breadcrumb) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <button className="text-primary hover:underline" onClick={onBucketClick}>
        {bucketName}
      </button>
      <ChevronRight className="text-muted-foreground h-4 w-4" />
      <span className="font-medium">업로드</span>
    </div>
  )
}
