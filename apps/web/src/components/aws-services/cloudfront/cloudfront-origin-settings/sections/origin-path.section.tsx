import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import type { CloudFrontOriginSectionProps } from '@/types/aws-services/cloudfront/origin-settings'

export function OriginPathSection({ control }: CloudFrontOriginSectionProps) {
  return (
    <SectionContainer
      title="Origin Path"
      description="특정 디렉토리를 루트로 사용하려면 경로를 입력하세요 (선택사항)"
    >
      <div className="space-y-2">
        <Controller
          name="originPath"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="/production" className="max-w-md" />
          )}
        />
        <div className="text-muted-foreground flex items-start gap-2 text-xs">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          <p>
            예: /production을 입력하면 CloudFront가 Origin/production에서
            콘텐츠를 가져옵니다
          </p>
        </div>
      </div>
    </SectionContainer>
  )
}
