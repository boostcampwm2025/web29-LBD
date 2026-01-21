import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'

import type {
  Bucket,
  S3ListSectionProps,
} from '@/types/aws-services/s3/bucket-list'

export const FooterInfoSection = ({ control, config }: S3ListSectionProps) => {
  const buckets = useWatch({ control, name: 'buckets' })
  const searchQuery = useWatch({ control, name: 'searchQuery' })

  const filteredCount = useMemo(() => {
    if (!searchQuery) return buckets.length
    return buckets.filter((bucket: Bucket) =>
      bucket.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ).length
  }, [buckets, searchQuery])

  if (!config.footerInfo) return null

  return (
    <div className="text-muted-foreground flex items-center justify-between text-sm">
      <p>총 {filteredCount}개의 버킷</p>
      {searchQuery && (
        <p>
          &quot;{searchQuery}&quot; 검색 결과: {filteredCount}개
        </p>
      )}
    </div>
  )
}
