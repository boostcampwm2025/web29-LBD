import { Globe, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateSectionProps {
  isSearchResult?: boolean
  onCreateDistribution?: () => void
}

export function EmptyStateSection({
  isSearchResult,
  onCreateDistribution,
}: EmptyStateSectionProps) {
  if (isSearchResult) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
        <Search className="mb-4 h-12 w-12" />
        <p className="text-sm">검색 결과가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Globe className="text-muted-foreground mb-4 h-16 w-16" />
      <div className="text-muted-foreground mb-6 text-center">
        <h3 className="mb-2 text-lg font-semibold">배포가 없습니다</h3>
        <p className="text-sm">
          CloudFront 배포를 생성하여 콘텐츠를 전 세계로 빠르게 전송하세요.
        </p>
      </div>
      <Button onClick={onCreateDistribution}>배포 생성</Button>
    </div>
  )
}
