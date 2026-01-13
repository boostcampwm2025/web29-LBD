'use client'

import { Info, Shield } from 'lucide-react'

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
import { Switch } from '@/components/ui/switch'

interface CloudFrontCacheBehaviorProps {
  onNext: () => void
  onPrev: () => void
  canGoPrev: boolean
}

export default function CloudFrontCacheBehavior({
  onNext,
  onPrev,
  canGoPrev,
}: CloudFrontCacheBehaviorProps) {
  // Viewer Protocol Policy
  const [viewerProtocolPolicy, setViewerProtocolPolicy] =
    React.useState('redirect-to-https')

  // Allowed HTTP Methods
  const [allowedMethods, setAllowedMethods] = React.useState('GET_HEAD')

  // Cache Policy
  const [cachePolicy, setCachePolicy] = React.useState('managed')
  const [managedPolicyName, setManagedPolicyName] =
    React.useState('CachingOptimized')
  const [customTTL, setCustomTTL] = React.useState({
    min: '0',
    default: '86400',
    max: '31536000',
  })

  // Compression
  const [compressionEnabled, setCompressionEnabled] = React.useState(true)

  // Functions
  const [viewerRequestFunction, setViewerRequestFunction] = React.useState('')
  const [viewerResponseFunction, setViewerResponseFunction] = React.useState('')

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">캐시 및 동작 설정</h1>
        <p className="text-muted-foreground">
          CloudFront 캐시 정책과 뷰어 액세스 제어를 구성하세요
        </p>
      </div>

      {/* Viewer Protocol Policy */}
      <SectionContainer
        title="Viewer Protocol Policy"
        description="뷰어와 CloudFront 간 통신 프로토콜을 선택하세요"
      >
        <div className="space-y-4">
          <RadioGroup
            value={viewerProtocolPolicy}
            onValueChange={setViewerProtocolPolicy}
          >
            {/* HTTP and HTTPS */}
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

            {/* Redirect HTTP to HTTPS */}
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

            {/* HTTPS Only */}
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

          <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <Shield className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              정적 웹사이트의 경우 보안을 위해 HTTPS 리디렉션 또는 HTTPS 전용을
              권장합니다.
            </p>
          </div>
        </div>
      </SectionContainer>

      <Separator />

      {/* Allowed HTTP Methods */}
      <SectionContainer
        title="허용된 HTTP 메서드"
        description="CloudFront가 처리하고 Origin으로 전달할 HTTP 메서드를 선택하세요"
      >
        <div className="space-y-4">
          <RadioGroup value={allowedMethods} onValueChange={setAllowedMethods}>
            {/* GET, HEAD */}
            <div className="flex items-start gap-3">
              <RadioGroupItem
                value="GET_HEAD"
                id="methods-get-head"
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="methods-get-head" className="font-semibold">
                  GET, HEAD <span className="text-primary text-sm">(권장)</span>
                </Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  읽기 전용 콘텐츠 (정적 웹사이트, 이미지, 비디오 등)
                </p>
              </div>
            </div>

            {/* GET, HEAD, OPTIONS */}
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

            {/* ALL */}
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
        </div>
      </SectionContainer>

      <Separator />

      {/* Cache Policy */}
      <SectionContainer
        title="캐시 정책"
        description="콘텐츠 캐싱 방법을 선택하세요"
      >
        <div className="space-y-4">
          <RadioGroup value={cachePolicy} onValueChange={setCachePolicy}>
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
                    <Select
                      value={managedPolicyName}
                      onValueChange={setManagedPolicyName}
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
                      <Input
                        id="ttl-min"
                        type="number"
                        value={customTTL.min}
                        onChange={(e) =>
                          setCustomTTL({ ...customTTL, min: e.target.value })
                        }
                        className="max-w-xs"
                      />
                      <p className="text-muted-foreground text-sm">
                        기본값: 0초
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ttl-default">기본 TTL (초)</Label>
                      <Input
                        id="ttl-default"
                        type="number"
                        value={customTTL.default}
                        onChange={(e) =>
                          setCustomTTL({
                            ...customTTL,
                            default: e.target.value,
                          })
                        }
                        className="max-w-xs"
                      />
                      <p className="text-muted-foreground text-sm">
                        기본값: 86400초 (24시간)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ttl-max">최대 TTL (초)</Label>
                      <Input
                        id="ttl-max"
                        type="number"
                        value={customTTL.max}
                        onChange={(e) =>
                          setCustomTTL({ ...customTTL, max: e.target.value })
                        }
                        className="max-w-xs"
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
        </div>
      </SectionContainer>

      <Separator />

      {/* Compression */}
      <SectionContainer
        title="압축"
        description="자동 객체 압축으로 전송 속도를 향상시킬 수 있습니다"
      >
        <div className="flex items-center gap-3">
          <Switch
            id="compression-enabled"
            checked={compressionEnabled}
            onCheckedChange={setCompressionEnabled}
          />
          <div className="flex-1">
            <Label htmlFor="compression-enabled">자동으로 객체 압축</Label>
            <p className="text-muted-foreground text-sm">
              CloudFront가 Gzip 및 Brotli 압축을 사용하여 지원 가능한 파일을
              자동으로 압축합니다 (권장)
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Function Associations (Advanced) */}
      <Accordion type="single" collapsible>
        <AccordionItem value="functions" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="text-left">
              <div className="font-semibold">Function 연결 (고급)</div>
              <div className="text-muted-foreground text-sm">
                CloudFront Functions를 연결하여 요청/응답 커스터마이징
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionContainer title="" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="viewer-request-function">
                    Viewer Request Function
                  </Label>
                  <Select
                    value={viewerRequestFunction}
                    onValueChange={setViewerRequestFunction}
                  >
                    <SelectTrigger id="viewer-request-function">
                      <SelectValue placeholder="Function 선택 (없음)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">없음</SelectItem>
                      <SelectItem value="url-rewrite">
                        URL Rewrite Function
                      </SelectItem>
                      <SelectItem value="add-headers">
                        Add Security Headers
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-sm">
                    뷰어 요청을 받은 직후 실행됩니다
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="viewer-response-function">
                    Viewer Response Function
                  </Label>
                  <Select
                    value={viewerResponseFunction}
                    onValueChange={setViewerResponseFunction}
                  >
                    <SelectTrigger id="viewer-response-function">
                      <SelectValue placeholder="Function 선택 (없음)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">없음</SelectItem>
                      <SelectItem value="add-security-headers">
                        Add Security Headers
                      </SelectItem>
                      <SelectItem value="modify-response">
                        Modify Response
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-sm">
                    뷰어에게 응답을 반환하기 직전 실행됩니다
                  </p>
                </div>

                <div className="text-muted-foreground bg-muted/50 flex items-start gap-2 rounded-md p-3 text-sm">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    CloudFront Functions는 간단한 요청/응답 조작에 사용되며,
                    Lambda@Edge보다 저렴하고 빠릅니다.
                  </p>
                </div>
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
          <Button onClick={onNext} size="lg" className="px-8">
            배포 생성
          </Button>
        </div>
      </div>
    </div>
  )
}
