import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CloudFrontCacheSectionProps } from '@/types/aws-services/cloudfront/cache-behavior'

export function HttpMethodsSection({ control }: CloudFrontCacheSectionProps) {
  return (
    <SectionContainer
      title="허용된 HTTP 메서드"
      description="CloudFront가 처리하고 Origin으로 전달할 HTTP 메서드를 선택하세요"
    >
      <div className="space-y-4">
        <Controller
          name="allowedMethods"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="GET_HEAD"
                  id="methods-get-head"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="methods-get-head" className="font-semibold">
                    GET, HEAD{' '}
                    <span className="text-primary text-sm">(권장)</span>
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    읽기 전용 콘텐츠 (정적 웹사이트, 이미지, 비디오 등)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="GET_HEAD_OPTIONS"
                  id="methods-get-head-options"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="methods-get-head-options"
                    className="font-semibold"
                  >
                    GET, HEAD, OPTIONS
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    CORS 프리플라이트 요청이 필요한 경우
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RadioGroupItem value="ALL" id="methods-all" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="methods-all" className="font-semibold">
                    GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    동적 콘텐츠나 API 엔드포인트의 경우
                  </p>
                </div>
              </div>
            </RadioGroup>
          )}
        />
      </div>
    </SectionContainer>
  )
}
