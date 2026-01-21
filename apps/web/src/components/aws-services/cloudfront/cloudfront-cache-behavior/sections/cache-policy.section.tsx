import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CloudFrontCacheSectionProps } from '@/types/aws-services/cloudfront/cache-behavior'

export function CachePolicySection({ control }: CloudFrontCacheSectionProps) {
  const cachePolicy = useWatch({ control, name: 'cachePolicy' })

  return (
    <SectionContainer
      title="캐시 정책"
      description="콘텐츠 캐싱 방법을 선택하세요"
    >
      <div className="space-y-4">
        <Controller
          name="cachePolicy"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              {/* Managed Policy */}
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="managed"
                  id="cache-managed"
                  className="mt-1"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor="cache-managed" className="font-semibold">
                      관리형 캐시 정책{' '}
                      <span className="text-primary text-sm">(권장)</span>
                    </Label>
                    <p className="text-muted-foreground mt-1 text-sm">
                      AWS에서 제공하는 미리 구성된 캐시 정책 사용
                    </p>
                  </div>
                  {cachePolicy === 'managed' && (
                    <div className="space-y-2">
                      <Label>정책 선택</Label>
                      <Controller
                        name="managedPolicyName"
                        control={control}
                        render={({ field: policyField }) => (
                          <Select
                            value={policyField.value}
                            onValueChange={policyField.onChange}
                          >
                            <SelectTrigger className="max-w-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CachingOptimized">
                                CachingOptimized (권장)
                              </SelectItem>
                              <SelectItem value="CachingDisabled">
                                CachingDisabled
                              </SelectItem>
                              <SelectItem value="CachingOptimizedForUncompressedObjects">
                                CachingOptimized (압축되지 않은 객체용)
                              </SelectItem>
                              <SelectItem value="Elemental-MediaPackage">
                                Elemental-MediaPackage
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <p className="text-muted-foreground text-sm">
                        CachingOptimized는 대부분의 정적 웹사이트에 적합합니다
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Policy */}
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="custom"
                  id="cache-custom"
                  className="mt-1"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor="cache-custom" className="font-semibold">
                      커스텀 캐시 정책
                    </Label>
                    <p className="text-muted-foreground mt-1 text-sm">
                      TTL 및 캐시 키 설정을 직접 구성
                    </p>
                  </div>
                  {cachePolicy === 'custom' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ttl-min">최소 TTL (초)</Label>
                        <Controller
                          name="customTTL.min"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="ttl-min"
                              type="number"
                              className="max-w-xs"
                            />
                          )}
                        />
                        <p className="text-muted-foreground text-sm">
                          기본값: 0초
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ttl-default">기본 TTL (초)</Label>
                        <Controller
                          name="customTTL.default"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="ttl-default"
                              type="number"
                              className="max-w-xs"
                            />
                          )}
                        />
                        <p className="text-muted-foreground text-sm">
                          기본값: 86400초 (24시간)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ttl-max">최대 TTL (초)</Label>
                        <Controller
                          name="customTTL.max"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="ttl-max"
                              type="number"
                              className="max-w-xs"
                            />
                          )}
                        />
                        <p className="text-muted-foreground text-sm">
                          기본값: 31536000초 (1년)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>
          )}
        />
      </div>
    </SectionContainer>
  )
}
