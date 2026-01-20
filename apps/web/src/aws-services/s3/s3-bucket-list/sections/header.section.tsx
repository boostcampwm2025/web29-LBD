import type { S3ListSectionProps } from '../types'

import { Button } from '@/components/ui/button'

interface HeaderSectionProps extends S3ListSectionProps {
  onCreateBucket: () => void
}

export const HeaderSection = ({
  config,
  onCreateBucket,
}: HeaderSectionProps) => {
  if (!config.header) return null

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold">버킷</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Amazon S3에 저장된 객체의 컨테이너입니다.
        </p>
      </div>
      <Button onClick={onCreateBucket}>버킷 생성</Button>
    </div>
  )
}
