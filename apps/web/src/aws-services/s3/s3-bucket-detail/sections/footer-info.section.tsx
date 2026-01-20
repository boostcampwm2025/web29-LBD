import type { S3DetailSectionProps, S3Object } from '../types'

import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'

export const FooterInfoSection = ({
  control,
  config,
}: S3DetailSectionProps) => {
  const objects = useWatch({ control, name: 'objects' })
  const searchQuery = useWatch({ control, name: 'searchQuery' })

  const filteredCount = useMemo(() => {
    if (!searchQuery) return objects.length
    return objects.filter((obj: S3Object) =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ).length
  }, [objects, searchQuery])

  if (!config.footerInfo) return null

  return (
    <div className="text-muted-foreground flex items-center justify-between text-sm">
      <p>총 {filteredCount}개의 객체</p>
      {searchQuery && (
        <p>
          &quot;{searchQuery}&quot; 검색 결과: {filteredCount}개
        </p>
      )}
    </div>
  )
}
