import type { CloudFrontListSectionProps } from '../types'
import { RefreshCw, Search } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarSectionProps extends CloudFrontListSectionProps {
  onRefresh?: () => void
}

export function SearchBarSection({
  control,
  onRefresh,
}: SearchBarSectionProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Controller
          name="searchQuery"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="배포 ID, 이름 또는 도메인으로 검색"
              className="pl-9"
            />
          )}
        />
      </div>
      <Button variant="outline" size="icon" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  )
}
