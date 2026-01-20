import { ChevronRight } from 'lucide-react'

import { useWatch } from 'react-hook-form'

import type { S3DetailSectionProps } from '@/types/aws-services/s3/bucket-detail'

export const BreadcrumbSection = ({
  control,
  config,
}: S3DetailSectionProps) => {
  const currentPath = useWatch({ control, name: 'currentPath' })

  if (!config.breadcrumb) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <button className="text-primary hover:underline">버킷</button>
      <ChevronRight className="text-muted-foreground h-4 w-4" />
      <span className="font-medium">{currentPath}</span>
    </div>
  )
}
