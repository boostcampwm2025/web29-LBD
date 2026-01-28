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
import type { SubnetFormData } from '@/types/aws-services/subnet/subnet-form-data.types'

// TODO: 나중에 리전에 따라 가용 영역 동적으로 불러오기
const AZ_OPTIONS = [
  { value: 'us-east-1a', label: 'us-east-1a' },
  { value: 'us-east-1b', label: 'us-east-1b' },
  { value: 'us-east-1c', label: 'us-east-1c' },
  { value: 'us-east-1d', label: 'us-east-1d' },
  { value: 'us-east-1e', label: 'us-east-1e' },
  { value: 'us-east-1f', label: 'us-east-1f' },
]

interface SubnetSettingsProps {
  control: Control<SubnetFormData>
  vpcCidr?: string // 선택된 VPC의 CIDR을 힌트로 제공
}

export function SubnetSettings({ control, vpcCidr }: SubnetSettingsProps) {
  return (
    <div className="bg-card text-card-foreground animate-in fade-in slide-in-from-top-4 rounded-lg border shadow-sm duration-300">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">서브넷 설정</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          서브넷의 CIDR 블록 및 가용 영역을 지정합니다.
        </p>
      </div>

      <div className="space-y-8 p-6">
        <SectionContainer
          title="서브넷 이름"
          description="'Name' 키와 사용자가 지정하는 값을 포함하는 태그를 생성합니다."
        >
          <Controller
            name="subnetSettings.nameTag"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="my-subnet-01"
                className="max-w-3xl"
              />
            )}
          />
        </SectionContainer>

        <SectionContainer
          title="가용 영역"
          description="서브넷이 상주할 영역을 선택합니다. 선택하지 않으면 Amazon이 자동으로 선택합니다."
        >
          <Controller
            name="subnetSettings.availabilityZone"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="max-w-3xl">
                  <SelectValue placeholder="가용 영역 선택" />
                </SelectTrigger>
                <SelectContent>
                  {AZ_OPTIONS.map((az) => (
                    <SelectItem key={az.value} value={az.value}>
                      {az.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </SectionContainer>

        <SectionContainer
          title="IPv4 서브넷 CIDR 블록"
          description={
            vpcCidr
              ? `VPC CIDR (${vpcCidr}) 내에 있어야 합니다.`
              : 'VPC CIDR 내에 있어야 합니다.'
          }
        >
          <Controller
            name="subnetSettings.cidrBlock"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="예: 10.0.1.0/24"
                className="max-w-3xl"
              />
            )}
          />
        </SectionContainer>
      </div>
    </div>
  )
}
