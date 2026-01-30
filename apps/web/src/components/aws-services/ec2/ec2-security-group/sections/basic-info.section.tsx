'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type {
  SecurityGroupFormData,
  VPCOption,
} from '@/types/aws-services/ec2/security-group'

interface BasicInfoSectionProps {
  form: UseFormReturn<SecurityGroupFormData>
  vpcOptions?: VPCOption[]
}

export function BasicInfoSection({
  form,
  vpcOptions = [],
}: BasicInfoSectionProps) {
  const { control } = form

  return (
    <SectionContainer
      title="기본 세부 정보"
      description="보안 그룹의 이름과 설명을 입력하세요"
    >
      <div className="space-y-4">
        {/* 보안 그룹 이름 */}
        <div className="space-y-2">
          <Label htmlFor="sg-name">
            보안 그룹 이름 <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="basicInfo.name"
            control={control}
            rules={{ required: '보안 그룹 이름을 입력하세요' }}
            render={({ field, fieldState }) => (
              <>
                <Input id="sg-name" placeholder="web-server-sg" {...field} />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <Label htmlFor="sg-description">설명</Label>
          <Controller
            name="basicInfo.description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="sg-description"
                placeholder="웹 서버용 보안 그룹"
                rows={2}
                {...field}
              />
            )}
          />
        </div>

        {/* VPC 선택 */}
        {/* VPC 선택 */}
        <div className="space-y-2">
          <Label htmlFor="sg-vpc">
            VPC <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="basicInfo.vpcId"
            control={control}
            rules={{ required: 'VPC를 선택하세요' }}
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="sg-vpc">
                    <SelectValue placeholder="VPC 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {vpcOptions.length > 0 ? (
                      vpcOptions.map((vpc) => (
                        <SelectItem key={vpc.id} value={vpc.id}>
                          {vpc.name} ({vpc.id})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="default-vpc">
                        default-vpc (vpc-default)
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </SectionContainer>
  )
}
