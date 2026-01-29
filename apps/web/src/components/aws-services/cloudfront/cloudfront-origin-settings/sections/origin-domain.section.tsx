import { Info } from 'lucide-react'

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
import type {
  CloudFrontOriginWithSetValueSectionProps,
  S3Bucket,
} from '@/types/aws-services/cloudfront/origin-settings'

const SAMPLE_S3_BUCKETS: S3Bucket[] = [
  { id: '1', name: 'my-application-assets', region: 'ap-northeast-2' },
  { id: '2', name: 'user-uploads-prod', region: 'ap-northeast-2' },
  { id: '3', name: 'static-website-bucket', region: 'us-east-1' },
  { id: '4', name: 'backup-data-storage', region: 'ap-northeast-1' },
  { id: '5', name: 'cdn-static-assets', region: 'us-west-2' },
]

export function OriginDomainSection({
  control,
}: CloudFrontOriginWithSetValueSectionProps) {
  const originType = useWatch({ control, name: 'originType' })
  const selectedBucket = useWatch({ control, name: 'selectedBucket' })

  const getOriginDomain = () => {
    if (originType === 's3' && selectedBucket) {
      const bucket = SAMPLE_S3_BUCKETS.find((b) => b.id === selectedBucket)
      if (bucket) {
        return `${bucket.name}.s3.${bucket.region}.amazonaws.com`
      }
    }
    return ''
  }

  return (
    <SectionContainer
      title="Origin Domain"
      description="CloudFront가 콘텐츠를 가져올 S3 버킷 또는 커스텀 Origin을 선택하세요"
    >
      <div className="space-y-4">
        <Controller
          name="originType"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              {/* S3 Bucket Option */}
              <div className="flex items-start gap-2">
                <RadioGroupItem value="s3" id="origin-s3" />
                <div className="flex-1 space-y-3">
                  <Label htmlFor="origin-s3" className="font-semibold">
                    Amazon S3 버킷
                  </Label>
                  {originType === 's3' && (
                    <div className="space-y-2">
                      <Controller
                        name="selectedBucket"
                        control={control}
                        render={({ field: selectField }) => (
                          <Select
                            value={selectField.value}
                            onValueChange={selectField.onChange}
                          >
                            <SelectTrigger className="max-w-md">
                              <SelectValue placeholder="S3 버킷 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {SAMPLE_S3_BUCKETS.map((bucket) => (
                                <SelectItem key={bucket.id} value={bucket.id}>
                                  {bucket.name} ({bucket.region})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {selectedBucket && (
                        <div className="text-muted-foreground bg-muted/50 rounded-md border border-dashed p-3 text-sm">
                          <div className="font-medium">Origin Domain:</div>
                          <div className="font-mono text-xs">
                            {getOriginDomain()}
                          </div>
                        </div>
                      )}
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Info className="h-3 w-3" />
                        <p>
                          선택한 S3 버킷이 자동으로 Origin Domain으로 설정됩니다
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Origin Option */}
              <div className="flex items-start gap-2">
                <RadioGroupItem value="custom" id="origin-custom" />
                <div className="flex-1 space-y-3">
                  <Label htmlFor="origin-custom" className="font-semibold">
                    커스텀 Origin
                  </Label>
                  {originType === 'custom' && (
                    <div className="space-y-2">
                      <Controller
                        name="customDomain"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="example.com"
                            className="max-w-md"
                          />
                        )}
                      />
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Info className="h-3 w-3" />
                        <p>웹 서버 도메인 이름을 입력하세요</p>
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
