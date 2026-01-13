'use client'

import { Info } from 'lucide-react'

import React from 'react'

import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'

// S3 버킷 샘플 데이터
const SAMPLE_S3_BUCKETS = [
  { id: '1', name: 'my-application-assets', region: 'ap-northeast-2' },
  { id: '2', name: 'user-uploads-prod', region: 'ap-northeast-2' },
  { id: '3', name: 'static-website-bucket', region: 'us-east-1' },
  { id: '4', name: 'backup-data-storage', region: 'ap-northeast-1' },
  { id: '5', name: 'cdn-static-assets', region: 'us-west-2' },
]

interface CloudFrontOriginSettingsProps {
  onNext: () => void
  onPrev: () => void
  canGoPrev: boolean
}

export default function CloudFrontOriginSettings({
  onNext,
  onPrev,
  canGoPrev,
}: CloudFrontOriginSettingsProps) {
  // Origin 타입 상태
  const [originType, setOriginType] = React.useState<'s3' | 'custom'>('s3')
  const [selectedBucket, setSelectedBucket] = React.useState('')
  const [customDomain, setCustomDomain] = React.useState('')
  const [originPath, setOriginPath] = React.useState('')

  // Access Control 상태
  const [accessControl, setAccessControl] = React.useState('oac')
  const [oacName, setOacName] = React.useState('')

  // Custom Headers 상태
  const [customHeaders, setCustomHeaders] = React.useState<
    Array<{ key: string; value: string }>
  >([])

  const addCustomHeader = () => {
    setCustomHeaders([...customHeaders, { key: '', value: '' }])
  }

  const removeCustomHeader = (index: number) => {
    setCustomHeaders(customHeaders.filter((_, i) => i !== index))
  }

  const updateCustomHeader = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const updated = [...customHeaders]
    updated[index][field] = value
    setCustomHeaders(updated)
  }

  // 선택된 버킷의 Origin Domain 생성
  const getOriginDomain = () => {
    if (originType === 's3' && selectedBucket) {
      const bucket = SAMPLE_S3_BUCKETS.find((b) => b.id === selectedBucket)
      if (bucket) {
        return `${bucket.name}.s3.${bucket.region}.amazonaws.com`
      }
    }
    return customDomain
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Origin 설정</h2>
        <p className="text-muted-foreground">
          CloudFront 배포의 콘텐츠 Origin을 구성하세요
        </p>
      </div>

      {/* Origin Domain */}
      <SectionContainer
        title="Origin Domain"
        description="CloudFront가 콘텐츠를 가져올 S3 버킷 또는 커스텀 Origin을 선택하세요"
      >
        <div className="space-y-4">
          <RadioGroup
            value={originType}
            onValueChange={(value: 's3' | 'custom') => setOriginType(value)}
          >
            {/* S3 Bucket Option */}
            <div className="flex items-start gap-3">
              <RadioGroupItem value="s3" id="origin-s3" className="mt-1" />
              <div className="flex-1 space-y-3">
                <Label htmlFor="origin-s3" className="font-semibold">
                  Amazon S3 버킷
                </Label>
                {originType === 's3' && (
                  <div className="space-y-3">
                    <Select
                      value={selectedBucket}
                      onValueChange={setSelectedBucket}
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
                    {selectedBucket && (
                      <div className="text-muted-foreground bg-muted/50 rounded-md border border-dashed p-3 text-sm">
                        <div className="font-medium">Origin Domain:</div>
                        <div className="font-mono text-xs">
                          {getOriginDomain()}
                        </div>
                      </div>
                    )}
                    <div className="text-muted-foreground flex items-start gap-2 text-sm">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        선택한 S3 버킷이 자동으로 Origin Domain으로 설정됩니다
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Origin Option */}
            <div className="flex items-start gap-3">
              <RadioGroupItem
                value="custom"
                id="origin-custom"
                className="mt-1"
              />
              <div className="flex-1 space-y-3">
                <Label htmlFor="origin-custom" className="font-semibold">
                  커스텀 Origin
                </Label>
                {originType === 'custom' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="example.com"
                      className="max-w-md"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                    <div className="text-muted-foreground flex items-start gap-2 text-sm">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>웹 서버 도메인 이름을 입력하세요</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>
        </div>
      </SectionContainer>

      <Separator />

      {/* Origin Path */}
      <SectionContainer
        title="Origin Path"
        description="특정 디렉토리를 루트로 사용하려면 경로를 입력하세요 (선택사항)"
      >
        <div className="space-y-2">
          <Input
            placeholder="/production"
            className="max-w-md"
            value={originPath}
            onChange={(e) => setOriginPath(e.target.value)}
          />
          <div className="text-muted-foreground flex items-start gap-2 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              예: /production을 입력하면 CloudFront가 {getOriginDomain()}
              /production에서 콘텐츠를 가져옵니다
            </p>
          </div>
        </div>
      </SectionContainer>

      <Separator />

      {/* Origin Access Control */}
      <SectionContainer
        title="Origin Access Control"
        description="S3 버킷에 대한 액세스 제어 방법을 선택하세요"
      >
        <div className="space-y-4">
          <RadioGroup value={accessControl} onValueChange={setAccessControl}>
            {/* OAC (권장) */}
            <div className="flex items-start gap-3">
              <RadioGroupItem value="oac" id="access-oac" className="mt-1" />
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor="access-oac" className="font-semibold">
                    Origin Access Control (OAC){' '}
                    <span className="text-primary text-sm">(권장)</span>
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    최신 방식으로 S3 버킷 정책을 통해 CloudFront만 액세스 허용
                  </p>
                </div>
                {accessControl === 'oac' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="oac-name">OAC 이름</Label>
                      <Input
                        id="oac-name"
                        placeholder="my-cloudfront-oac"
                        className="max-w-md"
                        value={oacName}
                        onChange={(e) => setOacName(e.target.value)}
                      />
                    </div>
                    <div className="text-muted-foreground bg-muted/50 rounded-md p-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>
                          배포 생성 후 S3 버킷 정책을 업데이트하여
                          CloudFront에서만 액세스할 수 있도록 설정해야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* OAI (레거시) */}
            <div className="flex items-start gap-3">
              <RadioGroupItem value="oai" id="access-oai" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="access-oai" className="font-semibold">
                  Origin Access Identity (OAI){' '}
                  <span className="text-muted-foreground text-sm">
                    (레거시)
                  </span>
                </Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  이전 방식의 액세스 제어 (신규 배포에는 권장하지 않음)
                </p>
              </div>
            </div>

            {/* Public Access */}
            <div className="flex items-start gap-3">
              <RadioGroupItem
                value="public"
                id="access-public"
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="access-public" className="font-semibold">
                  Public Access
                </Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  S3 버킷이 퍼블릭으로 설정된 경우 선택
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </SectionContainer>

      {/* Custom Headers (Advanced) */}
      <Accordion type="single" collapsible>
        <AccordionItem value="custom-headers" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="text-left">
              <div className="font-semibold">Custom Headers (고급)</div>
              <div className="text-muted-foreground text-sm">
                Origin으로 전달할 커스텀 HTTP 헤더 추가
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionContainer title="" className="mt-4">
              <div className="space-y-3">
                {customHeaders.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Header Name"
                      value={header.key}
                      onChange={(e) =>
                        updateCustomHeader(index, 'key', e.target.value)
                      }
                    />
                    <Input
                      placeholder="Header Value"
                      value={header.value}
                      onChange={(e) =>
                        updateCustomHeader(index, 'value', e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      onClick={() => removeCustomHeader(index)}
                    >
                      제거
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addCustomHeader}>
                  헤더 추가
                </Button>
              </div>
            </SectionContainer>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={onPrev} disabled={!canGoPrev}>
          이전
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">이전</Button>
          <Button onClick={onNext}>다음 단계</Button>
        </div>
      </div>
    </div>
  )
}
