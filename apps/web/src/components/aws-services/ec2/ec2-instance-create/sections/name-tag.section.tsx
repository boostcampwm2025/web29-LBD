import { Controller } from 'react-hook-form'

import { TooltipBox } from '@/components/aws-services/common/tooltip-box'
import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EC2_TOOLTIPS } from '@/constants/aws-services/ec2'
import type { EC2SectionProps } from '@/types/aws-services/ec2/ec2-instance-create'

export function NameTag({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          이름 및 태그
          <TooltipBox content={EC2_TOOLTIPS.nameTag} />
        </div>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="instance-name">이름</Label>
        <Controller
          name="nameTag.name"
          control={control}
          render={({ field }) => (
            <Input
              id="instance-name"
              placeholder="my-ec2-instance"
              {...field}
            />
          )}
        />
      </div>
    </SectionContainer>
  )
}
