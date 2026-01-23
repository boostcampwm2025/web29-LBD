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
import { EC2_TOOLTIPS, KEY_PAIR_OPTIONS } from '@/constants/aws-services/ec2'
import type { EC2SectionProps } from '@/types/aws-services/ec2/ec2-instance-create'

export function KeyPair({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          키 페어(로그인)
          <TooltipBox content={EC2_TOOLTIPS.keyPair} />
        </div>
      }
      description="키 페어를 사용하여 인스턴스에 안전하게 연결하세요"
    >
      <div className="space-y-4">
        <Controller
          name="keyPair.keyName"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="key-pair">키 페어 이름 - 필수</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="key-pair" className="max-w-md">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  {KEY_PAIR_OPTIONS.map((keyPair) => (
                    <SelectItem key={keyPair.value} value={keyPair.value}>
                      {keyPair.label}
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
