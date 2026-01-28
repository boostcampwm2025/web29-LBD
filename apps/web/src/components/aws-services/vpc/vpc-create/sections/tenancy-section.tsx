'use client'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { VpcSectionProps } from '@/types/aws-services/vpc/vpc-config.types'

export function Tenancy({ control }: VpcSectionProps) {
  return (
    <SectionContainer title="테넌시">
      <Controller
        name="tenancy.type"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="max-w-2xl">
              <SelectValue placeholder="테넌시 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">기본값</SelectItem>
              <SelectItem value="dedicated">전용</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </SectionContainer>
  )
}
