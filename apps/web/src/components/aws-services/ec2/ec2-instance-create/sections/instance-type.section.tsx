import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { EC2_TOOLTIPS } from '@/constants/aws-services/ec2/ec2-tooltips.constants'
import type { EC2SectionProps } from '@/types/aws-services/ec2/ec2-instance-create'

// 인스턴스 유형 옵션
const INSTANCE_TYPE_OPTIONS = [
  {
    value: 't2.micro',
    label: 't2.micro',
    vcpu: '1 vCPU',
    memory: '1 GiB',
  },
  {
    value: 't2.small',
    label: 't2.small',
    vcpu: '1 vCPU',
    memory: '2 GiB',
  },
  {
    value: 't2.medium',
    label: 't2.medium',
    vcpu: '2 vCPU',
    memory: '4 GiB',
  },
  {
    value: 't3.micro',
    label: 't3.micro',
    vcpu: '2 vCPU',
    memory: '1 GiB',
  },
  {
    value: 't3.small',
    label: 't3.small',
    vcpu: '2 vCPU',
    memory: '2 GiB',
  },
  {
    value: 't3.medium',
    label: 't3.medium',
    vcpu: '2 vCPU',
    memory: '4 GiB',
  },
] as const

export function InstanceType({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          인스턴스 유형
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-center">
                <p>{EC2_TOOLTIPS.instanceType}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      }
      description="애플리케이션에 적합한 인스턴스 유형을 선택하세요"
    >
      <div className="space-y-4">
        <Controller
          name="instanceType.type"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="instance-type">인스턴스 유형 선택</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="instance-type" className="max-w-md">
                  <SelectValue placeholder="인스턴스 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {INSTANCE_TYPE_OPTIONS.map((instance) => (
                    <SelectItem key={instance.value} value={instance.value}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold">{instance.label}</span>
                        <span className="text-muted-foreground text-sm">
                          {instance.vcpu} • {instance.memory}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </SectionContainer>
  )
}
