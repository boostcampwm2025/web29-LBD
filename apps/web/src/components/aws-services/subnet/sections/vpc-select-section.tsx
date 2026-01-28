'use client'

import { Controller, useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SubnetFormData } from '@/types/aws-services/subnet/subnet-form-data.types'

interface VpcSelectProps {
  control: Control<SubnetFormData>
  vpcs: { id: string; name: string; cidrBlock: string }[]
}

export function VpcSelect({ control, vpcs }: VpcSelectProps) {
  // 선택된 VPC ID를 감지하여 CIDR 정보를 표시
  const selectedVpcId = useWatch({ control, name: 'vpcId' })
  const selectedVpc = vpcs.find((vpc) => vpc.id === selectedVpcId)

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">VPC</h2>
      </div>

      <div className="space-y-6 p-6">
        <SectionContainer
          title="VPC ID"
          description="이 VPC에 서브넷을 생성합니다."
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

        {/* VPC 선택 시 보여주는 정보 (스크린샷 참조) */}
        {selectedVpc && (
          <div className="space-y-1">
            <Label className="text-sm font-semibold">연결된 VPC CIDR</Label>
            <div className="text-sm">IPv4 CIDR: {selectedVpc.cidrBlock}</div>
          </div>
        )}
      </div>
    </div>
  )
}
