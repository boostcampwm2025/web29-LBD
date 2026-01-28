'use client'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { VpcSectionProps } from '@/types/aws-services/vpc/vpc-config.types'

export function EncryptionControl({ control }: VpcSectionProps) {
  return (
    <SectionContainer
      title="VPC 암호화 제어 ($)"
      description="모니터링 모드를 사용하면 트래픽을 차단하지 않고 암호화 상태를 확인합니다."
    >
      <Controller
        name="encryption.mode"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {[
              { value: 'none', label: '없음', desc: '' },
              {
                value: 'monitoring',
                label: '모니터링 모드',
                desc: '암호화되지 않은 리소스 생성을 허용하는지 확인하세요.',
              },
              {
                value: 'enforcing',
                label: '적용 모드',
                desc: '암호화되지 않은 리소스 생성을 차단합니다.',
              },
            ].map((opt) => (
              <Label
                key={opt.value}
                className={cn(
                  'hover:bg-accent flex cursor-pointer flex-col space-y-2 rounded-lg border p-4',
                  field.value === opt.value
                    ? 'border-primary ring-primary bg-primary/5 ring-1'
                    : 'border-muted',
                )}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} id={`enc-${opt.value}`} />
                  <span className="font-bold">{opt.label}</span>
                </div>
                {opt.desc && (
                  <p className="text-muted-foreground pl-6 text-xs">
                    {opt.desc}
                  </p>
                )}
              </Label>
            ))}
          </RadioGroup>
        )}
      />
    </SectionContainer>
  )
}
