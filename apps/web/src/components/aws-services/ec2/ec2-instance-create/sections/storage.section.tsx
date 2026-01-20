import { Info } from 'lucide-react'

import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
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

// 볼륨 유형 옵션
const VOLUME_TYPE_OPTIONS = [
  {
    value: 'gp3',
    label: '범용 SSD (gp3)',
    iops: '3000 IOPS',
  },
  {
    value: 'gp2',
    label: '범용 SSD (gp2)',
    iops: '',
  },
  {
    value: 'io1',
    label: '프로비저닝된 IOPS SSD (io1)',
    iops: '400 IOPS',
  },
  {
    value: 'io2',
    label: '프로비저닝된 IOPS SSD (io2)',
    iops: '8000 IOPS',
  },
  {
    value: 'standard',
    label: '마그네틱(표준)',
    iops: '',
  },
] as const

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-center">
                <p>{EC2_TOOLTIPS.storage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
