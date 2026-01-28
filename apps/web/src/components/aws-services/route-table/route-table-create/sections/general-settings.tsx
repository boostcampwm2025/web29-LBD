'use client'

import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RouteTableCreateFormData } from '@/types/aws-services/route-table.types'

interface GeneralSettingsProps {
  control: Control<RouteTableCreateFormData>
  vpcs: { id: string; name: string; cidrBlock: string }[]
}

export function GeneralSettings({ control, vpcs }: GeneralSettingsProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">라우팅 테이블 설정</h2>
      </div>

      <div className="space-y-6 p-6">
        {/* 이름 입력 */}
        <SectionContainer
          title="이름 - 선택 사항"
          description="'Name' 키와 사용자가 지정하는 값을 포함하는 태그를 생성합니다."
        >
          <Controller
            name="nameTag"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="my-route-table-01"
                className="max-w-3xl"
              />
            )}
          />
        </SectionContainer>

        {/* VPC 선택 */}
        <SectionContainer
          title="VPC"
          description="이 라우팅 테이블에 대해 사용할 VPC입니다."
        >
          <Controller
            name="vpcId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="max-w-3xl">
                  <SelectValue placeholder="VPC 선택" />
                </SelectTrigger>
                <SelectContent>
                  {vpcs.map((vpc) => (
                    <SelectItem key={vpc.id} value={vpc.id}>
                      {vpc.id} ({vpc.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </SectionContainer>
      </div>
    </div>
  )
}
