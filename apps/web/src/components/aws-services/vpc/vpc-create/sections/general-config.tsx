'use client'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { VpcSectionProps } from '@/types/aws-services/vpc/vpc-config.types'

export function GeneralConfig({ control }: VpcSectionProps) {
  return (
    <div className="space-y-6">
      {/* 이름 태그 */}
      <SectionContainer
        title="이름 태그 - 선택 사항"
        description="'Name' 키와 사용자가 지정하는 값을 포함하는 태그를 생성합니다."
      >
        <Controller
          name="nameTag.name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="my-vpc-01" className="max-w-2xl" />
          )}
        />
      </SectionContainer>
    </div>
  )
}
