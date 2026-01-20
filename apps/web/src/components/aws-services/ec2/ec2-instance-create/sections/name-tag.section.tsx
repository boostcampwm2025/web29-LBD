import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { EC2SectionProps } from '@/types/aws-services/ec2'

export function NameTag({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          이름 및 태그
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-center">
                <p>
                  인스턴스에 이름을 지정하면 AWS 콘솔에서 쉽게 식별할 수
                  있습니다. 태그는 리소스를 분류하고 관리하는 데 사용되는 키-값
                  쌍입니다.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
