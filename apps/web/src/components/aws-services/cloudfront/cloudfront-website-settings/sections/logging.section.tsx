import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { CloudFrontWebsiteSectionProps } from '@/types/aws-services/cloudfront/website-settings'

const SAMPLE_S3_BUCKETS = [
  { id: '1', name: 'cloudfront-logs-bucket', region: 'us-east-1' },
  { id: '2', name: 'my-logging-bucket', region: 'ap-northeast-2' },
  { id: '3', name: 'application-logs', region: 'us-west-2' },
]

export function LoggingSection({ control }: CloudFrontWebsiteSectionProps) {
  const loggingEnabled = useWatch({ control, name: 'loggingEnabled' })

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="logging" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          <div className="text-left">
            <div className="font-semibold">로깅</div>
            <div className="text-muted-foreground text-sm">
              CloudFront 액세스 로그를 S3에 저장
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <SectionContainer title="" className="mt-4">
            <div className="space-y-4">
              <Controller
                name="loggingEnabled"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch
                      id="logging-enabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="flex-1">
                      <Label htmlFor="logging-enabled">표준 로그 활성화</Label>
                      <p className="text-muted-foreground text-sm">
                        모든 요청을 S3 버킷에 로그로 저장합니다
                      </p>
                    </div>
                  </div>
                )}
              />

              {loggingEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logging-bucket">S3 버킷</Label>
                    <Controller
                      name="loggingBucket"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="logging-bucket"
                            className="max-w-md"
                          >
                            <SelectValue placeholder="로그 저장용 S3 버킷 선택" />
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="log-prefix">로그 접두사 (선택)</Label>
                    <Controller
                      name="logPrefix"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="log-prefix"
                          placeholder="cloudfront-logs/"
                          className="max-w-md"
                        />
                      )}
                    />
                    <p className="text-muted-foreground text-sm">
                      로그 파일명 앞에 추가될 접두사입니다
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SectionContainer>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
