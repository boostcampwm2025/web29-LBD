import { Search } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import type { S3DetailSectionProps } from '@/types/aws-services/s3/bucket-detail'

export const SearchBarSection = ({ control, config }: S3DetailSectionProps) => {
  if (!config.searchBar) return null

  return (
    <Controller
      name="searchQuery"
      control={control}
      render={({ field }) => (
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="객체 이름으로 검색"
            value={field.value}
            onChange={field.onChange}
            className="pl-9"
          />
        </div>
      )}
    />
  )
}
