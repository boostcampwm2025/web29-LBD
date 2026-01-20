import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { EC2_TOOLTIPS } from '@/constants/aws-services/ec2/ec2-tooltips.constants'
import type { EC2SectionProps } from '@/types/aws-services/ec2/ec2-instance-create'

// AMI 옵션 정의
const AMI_OPTIONS = [
  {
    value: 'amazon-linux',
    label: 'Amazon Linux',
    description: 'AWS에 최적화된 Linux 배포판',
  },
  {
    value: 'ubuntu',
    label: 'Ubuntu',
    description: '가장 인기 있는 Linux 배포판',
  },
  {
    value: 'windows',
    label: 'Windows',
    description: 'Microsoft Windows Server',
  },
  {
    value: 'mac-os',
    label: 'macOS',
    description: 'Apple macOS',
  },
  {
    value: 'red-hat',
    label: 'Red Hat',
    description: 'Red Hat Enterprise Linux',
  },
  {
    value: 'suse-linux',
    label: 'SUSE Linux',
    description: 'SUSE Linux Enterprise',
  },
  {
    value: 'debian',
    label: 'Debian',
    description: 'Debian GNU/Linux',
  },
] as const

export function Ami({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          애플리케이션 및 OS 이미지 (Amazon Machine Image)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-center">
                <p>{EC2_TOOLTIPS.ami}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      }
      description="인스턴스에서 실행할 운영 체제를 선택하세요"
    >
      <div className="space-y-4">
        <Label>Quick Start</Label>

        <Controller
          name="ami.osType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {AMI_OPTIONS.map((ami) => (
                <div key={ami.value}>
                  <RadioGroupItem
                    value={ami.value}
                    id={ami.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={ami.value}
                    className="bg-card hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-primary flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-all peer-data-[state=checked]:ring-2"
                  >
                    <span className="text-center text-sm font-medium">
                      {ami.label}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />

        {/* 선택한 AMI 정보 표시 */}
        <Controller
          name="ami.osType"
          control={control}
          render={({ field }) => {
            const selectedAmi = AMI_OPTIONS.find(
              (ami) => ami.value === field.value,
            )
            return selectedAmi ? (
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="font-semibold">{selectedAmi.label} 이미지</h4>
                <p className="text-muted-foreground text-sm">
                  {selectedAmi.description}
                </p>
              </div>
            ) : null
          }}
        />
      </div>
    </SectionContainer>
  )
}
