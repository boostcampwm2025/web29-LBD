import { RefreshCw, Search } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { S3ListSectionProps } from '@/types/aws-services/s3/bucket-list'

interface SearchBarSectionProps extends S3ListSectionProps {
  onRefresh: () => void
}

export const SearchBarSection = ({
  control,
  config,
  onRefresh,
}: SearchBarSectionProps) => {
  if (!config.searchBar) return null

  return (
    <Controller
      name="searchQuery"
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="버킷 이름으로 검색"
              value={field.value}
              onChange={field.onChange}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  )
}
