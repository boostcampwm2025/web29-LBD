import { Controller } from 'react-hook-form'

import { TooltipBox } from '@/components/aws-services/common/tooltip-box'
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
  EC2_TOOLTIPS,
  INSTANCE_TYPE_OPTIONS,
} from '@/constants/aws-services/ec2'
import type { EC2SectionProps } from '@/types/aws-services/ec2/ec2-instance-create'

export function InstanceType({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          인스턴스 유형
          <TooltipBox content={EC2_TOOLTIPS.instanceType} />
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
