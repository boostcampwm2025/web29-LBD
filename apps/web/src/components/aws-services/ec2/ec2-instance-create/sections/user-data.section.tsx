import { Controller } from 'react-hook-form'

import { TooltipBox } from '@/components/aws-services/common/tooltip-box'
import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EC2_TOOLTIPS } from '@/constants/aws-services/ec2'
import type { EC2SectionProps } from '@/types/aws-services/ec2/instance-create'

export function UserData({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          고급 세부 정보 - User Data
          <TooltipBox content={EC2_TOOLTIPS.userData} />
        </div>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="user-data-script">User data</Label>
        <Controller
          name="userData.script"
          control={control}
          render={({ field }) => (
            <Textarea
              id="user-data-script"
              placeholder={
                '#!/bin/bash\nyum update -y\n# 설치 스크립트 작성...'
              }
              className="min-h-[150px] font-mono text-sm"
              {...field}
              value={field.value ?? ''}
            />
          )}
        />
        <p className="text-muted-foreground text-xs">
          인스턴스가 시작될 때 root 권한으로 실행됩니다.
        </p>
      </div>
    </SectionContainer>
  )
}
