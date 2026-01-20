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

// 키 페어 옵션 (나중에 백엔드에서 받아올 예정)
const KEY_PAIR_OPTIONS = [
  { value: 'my-key-pair', label: 'my-key-pair' },
  { value: 'dev-key-pair', label: 'dev-key-pair' },
  { value: 'prod-key-pair', label: 'prod-key-pair' },
] as const

export function KeyPair({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          키 페어(로그인)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-center">
                <p>{EC2_TOOLTIPS.keyPair}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
