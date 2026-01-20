import type { CloudFrontCacheSectionProps } from '../types'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function CompressionSection({ control }: CloudFrontCacheSectionProps) {
  return (
    <SectionContainer
      title="압축"
      description="자동 객체 압축으로 전송 속도를 향상시킬 수 있습니다"
    >
      <Controller
        name="compressionEnabled"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="compression-enabled"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <div className="flex-1">
              <Label htmlFor="compression-enabled">자동으로 객체 압축</Label>
              <p className="text-muted-foreground text-sm">
                CloudFront가 Gzip 및 Brotli 압축을 사용하여 지원 가능한 파일을
                자동으로 압축합니다 (권장)
              </p>
            </div>
          </div>
        )}
      />
    </SectionContainer>
  )
}
