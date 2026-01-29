import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CloudFrontSettingsSectionProps } from '@/types/aws-services/cloudfront/distribution-settings'

export function PriceClassSection({ control }: CloudFrontSettingsSectionProps) {
  return (
    <SectionContainer
      title="Price Class"
      description="배포에 사용할 엣지 로케이션 범위를 선택하세요"
    >
      <div className="space-y-4">
        <Controller
          name="priceClass"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              <div className="flex items-start gap-3">
                <RadioGroupItem value="all" id="price-all" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="price-all" className="font-semibold">
                    모든 엣지 로케이션 사용
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    최고 성능 | 비용: 높음 | 전세계 모든 CloudFront 엣지
                    로케이션 사용
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="performance"
                  id="price-performance"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="price-performance" className="font-semibold">
                    북미, 유럽, 아시아, 중동 및 아프리카{' '}
                    <span className="text-primary text-sm">(권장)</span>
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    균형잡힌 성능 | 비용: 중간 | 대부분의 사용자에게 최적
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="cost-optimized"
                  id="price-cost"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="price-cost" className="font-semibold">
                    북미 및 유럽만 사용
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    비용 최적화 | 비용: 낮음 | 북미와 유럽 사용자만 대상으로
                    하는 경우
                  </p>
                </div>
              </div>
            </RadioGroup>
          )}
        />

        <div className="text-muted-foreground bg-muted/50 flex items-start gap-2 rounded-md p-3 text-xs">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          <p>
            Price Class는 배포 생성 후에도 변경할 수 있습니다. 트래픽 패턴을
            확인한 후 최적화하세요.
          </p>
        </div>
      </div>
    </SectionContainer>
  )
}
