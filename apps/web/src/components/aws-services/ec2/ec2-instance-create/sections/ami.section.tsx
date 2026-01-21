import { Controller, useWatch } from 'react-hook-form'

import { TooltipBox } from '@/components/aws-services/common/tooltip-box'
import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AMI_OPTIONS, EC2_TOOLTIPS } from '@/constants/aws-services/ec2'
import type { EC2SectionProps } from '@/types/aws-services/ec2/ec2-instance-create'

export function Ami({ control }: EC2SectionProps) {
  const selectedOsType = useWatch({
    control,
    name: 'ami.osType',
  })
  const selectedAmi = AMI_OPTIONS.find((ami) => ami.value === selectedOsType)

  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          애플리케이션 및 OS 이미지 (Amazon Machine Image)
          <TooltipBox content={EC2_TOOLTIPS.ami} />
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
                    className="bg-card hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-primary flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-all peer-data-[state=checked]:ring-1"
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
        {selectedAmi && (
          <div className="bg-muted/50 rounded-lg border p-4">
            <h4 className="font-semibold">{selectedAmi.label} 이미지</h4>
            <p className="text-muted-foreground text-sm">
              {selectedAmi.description}
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  )
}
