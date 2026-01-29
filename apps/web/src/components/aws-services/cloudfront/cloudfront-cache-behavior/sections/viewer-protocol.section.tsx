import { Shield } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CloudFrontCacheSectionProps } from '@/types/aws-services/cloudfront/cache-behavior'

export function ViewerProtocolSection({
  control,
}: CloudFrontCacheSectionProps) {
  return (
    <SectionContainer
      title="Viewer Protocol Policy"
      description="뷰어와 CloudFront 간 통신 프로토콜을 선택하세요"
    >
      <div className="space-y-4">
        <Controller
          name="viewerProtocolPolicy"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="allow-all"
                  id="protocol-allow-all"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="protocol-allow-all" className="font-semibold">
                    HTTP 및 HTTPS
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    뷰어가 HTTP와 HTTPS를 모두 사용할 수 있습니다
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="redirect-to-https"
                  id="protocol-redirect"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="protocol-redirect" className="font-semibold">
                    HTTP를 HTTPS로 리디렉션{' '}
                    <span className="text-primary text-sm">(권장)</span>
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    HTTP 요청을 자동으로 HTTPS로 리디렉션합니다
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="https-only"
                  id="protocol-https"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="protocol-https" className="font-semibold">
                    HTTPS만 허용
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    HTTP 요청을 거부하고 HTTPS만 허용합니다
                  </p>
                </div>
              </div>
            </RadioGroup>
          )}
        />

        <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
          <Shield className="mt-0.5 h-3 w-3 shrink-0" />
          <p>
            정적 웹사이트의 경우 보안을 위해 HTTPS 리디렉션 또는 HTTPS 전용을
            권장합니다.
          </p>
        </div>
      </div>
    </SectionContainer>
  )
}
