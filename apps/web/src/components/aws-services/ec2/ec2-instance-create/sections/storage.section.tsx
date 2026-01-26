import { Controller, useWatch } from 'react-hook-form'

import { TooltipBox } from '@/components/aws-services/common/tooltip-box'
import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EC2_TOOLTIPS, VOLUME_TYPE_OPTIONS } from '@/constants/aws-services/ec2'
import type { EC2SectionProps } from '@/types/aws-services/ec2/instance-create'

export function Storage({ control }: EC2SectionProps) {
  // 현재 선택된 볼륨 타입 감시
  const selectedVolumeType = useWatch({
    control,
    name: 'storage.volumeType',
  })
  const volumeInfo = VOLUME_TYPE_OPTIONS.find(
    (v) => v.value === selectedVolumeType,
  )
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          스토리지 구성
          <TooltipBox content={EC2_TOOLTIPS.storage} />
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">1x</span>
        <Controller
          name="storage.size"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              min={8}
              max={16384}
              className="w-20"
              {...field}
              value={field.value ?? 8}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <span className="text-muted-foreground">GiB</span>
        <Controller
          name="storage.volumeType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VOLUME_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <span className="text-muted-foreground text-sm">
          루트 볼륨, {volumeInfo?.iops || '3000 IOPS'}, 암호화되지 않음
        </span>
      </div>
    </SectionContainer>
  )
}
