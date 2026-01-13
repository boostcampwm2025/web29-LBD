'use client'

import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

// S3 버킷 샘플 데이터 (로깅용)
interface CloudFrontWebsiteSettingsProps {
  onNext: () => void
  onPrev: () => void
  canGoPrev: boolean
}

const SAMPLE_S3_BUCKETS = [
  { id: '1', name: 'cloudfront-logs-bucket', region: 'us-east-1' },
  { id: '2', name: 'my-logging-bucket', region: 'ap-northeast-2' },
  { id: '3', name: 'application-logs', region: 'us-west-2' },
]

interface ErrorResponse {
  errorCode: string
  responsePagePath: string
  responseCode: string
  ttl: string
}

export default function CloudFrontWebsiteSettings({
  onNext,
  onPrev,
  canGoPrev,
}: CloudFrontWebsiteSettingsProps) {
  // Default Root Object (핵심!)
  const [defaultRootObject, setDefaultRootObject] = React.useState('index.html')

  // Custom Error Responses
  const [errorResponses, setErrorResponses] = React.useState<ErrorResponse[]>(
    [],
  )

  const addErrorResponse = () => {
    setErrorResponses([
      ...errorResponses,
      {
        errorCode: '404',
        responsePagePath: '/404.html',
        responseCode: '404',
        ttl: '300',
      },
    ])
  }

  const updateErrorResponse = (
    index: number,
    field: keyof ErrorResponse,
    value: string,
  ) => {
    const updated = [...errorResponses]
    updated[index][field] = value
    setErrorResponses(updated)
  }

  const removeErrorResponse = (index: number) => {
    setErrorResponses(errorResponses.filter((_, i) => i !== index))
  }

  // Logging
  const [loggingEnabled, setLoggingEnabled] = React.useState(false)
  const [loggingBucket, setLoggingBucket] = React.useState('')
  const [logPrefix, setLogPrefix] = React.useState('')

  // WAF
  const [wafEnabled, setWafEnabled] = React.useState(false)
  const [webAclId, setWebAclId] = React.useState('')

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">일반 설정 편집</h2>
        <p className="text-muted-foreground">
          Default Root Object 및 기타 웹사이트 설정을 구성하세요
        </p>
      </div>

      {/* Default Root Object - 핵심 기능! */}
      <SectionContainer
        title={
          <div className="flex items-center gap-2">
            <span>기본 루트 객체</span>
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
              필수
            </span>
          </div>
        }
        description="루트 URL 접근 시 CloudFront가 반환할 기본 파일을 지정하세요"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-root-object">기본 루트 객체</Label>
            <Input
              id="default-root-object"
              placeholder="index.html"
              value={defaultRootObject}
              onChange={(e) => setDefaultRootObject(e.target.value)}
              className="max-w-md"
            />
            <p className="text-muted-foreground text-sm">
              예: index.html, home.html, default.html
            </p>
          </div>

          {/* 예시 설명 */}
          <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-2 text-sm font-semibold text-blue-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>기본 루트 객체의 동작 방식</span>
            </div>
            <div className="space-y-2 text-sm text-blue-900">
              <div className="font-mono">
                <div className="text-muted-foreground">
                  사용자가 다음과 같이 접근:
                </div>
                <div>https://d111111abcdef8.cloudfront.net/</div>
              </div>
              <div className="flex items-center gap-2">
                <span>↓</span>
                <span>CloudFront가 자동으로 변환</span>
              </div>
              <div className="font-mono">
                <div>
                  https://d111111abcdef8.cloudfront.net/
                  <span className="bg-blue-200 px-1">{defaultRootObject}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="flex items-start gap-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">중요:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>지정한 파일이 S3 버킷의 루트에 실제로 존재해야 합니다</li>
                <li>
                  하위 디렉토리에는 적용되지 않습니다 (예: /docs/는 별도 설정
                  필요)
                </li>
                <li>파일명은 대소문자를 구분합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </SectionContainer>

      <Separator />

      {/* Custom Error Responses */}
      <Accordion type="single" collapsible>
        <AccordionItem value="error-pages" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="text-left">
              <div className="font-semibold">커스텀 오류 페이지</div>
              <div className="text-muted-foreground text-sm">
                HTTP 오류 발생 시 사용자에게 보여줄 커스텀 페이지 설정
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionContainer title="" className="mt-4">
              <div className="space-y-4">
                {errorResponses.map((errorResponse, index) => (
                  <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>HTTP 오류 코드</Label>
                        <Select
                          value={errorResponse.errorCode}
                          onValueChange={(value) =>
                            updateErrorResponse(index, 'errorCode', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">400 Bad Request</SelectItem>
                            <SelectItem value="403">403 Forbidden</SelectItem>
                            <SelectItem value="404">404 Not Found</SelectItem>
                            <SelectItem value="405">
                              405 Method Not Allowed
                            </SelectItem>
                            <SelectItem value="500">
                              500 Internal Server Error
                            </SelectItem>
                            <SelectItem value="502">502 Bad Gateway</SelectItem>
                            <SelectItem value="503">
                              503 Service Unavailable
                            </SelectItem>
                            <SelectItem value="504">
                              504 Gateway Timeout
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>응답 페이지 경로</Label>
                        <Input
                          placeholder="/404.html"
                          value={errorResponse.responsePagePath}
                          onChange={(e) =>
                            updateErrorResponse(
                              index,
                              'responsePagePath',
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>응답 코드</Label>
                        <Select
                          value={errorResponse.responseCode}
                          onValueChange={(value) =>
                            updateErrorResponse(index, 'responseCode', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="200">200 OK</SelectItem>
                            <SelectItem value="404">404 Not Found</SelectItem>
                            <SelectItem value="403">403 Forbidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>오류 캐싱 최소 TTL (초)</Label>
                        <Input
                          type="number"
                          placeholder="300"
                          value={errorResponse.ttl}
                          onChange={(e) =>
                            updateErrorResponse(index, 'ttl', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeErrorResponse(index)}
                    >
                      제거
                    </Button>
                  </div>
                ))}

                <Button variant="outline" onClick={addErrorResponse}>
                  오류 응답 추가
                </Button>

                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    일반적으로 404 오류를 /404.html로, 403 오류를 /403.html로
                    매핑합니다.
                  </p>
                </div>
              </div>
            </SectionContainer>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Logging */}
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
                <div className="flex items-center gap-3">
                  <Switch
                    id="logging-enabled"
                    checked={loggingEnabled}
                    onCheckedChange={setLoggingEnabled}
                  />
                  <div className="flex-1">
                    <Label htmlFor="logging-enabled">표준 로그 활성화</Label>
                    <p className="text-muted-foreground text-sm">
                      모든 요청을 S3 버킷에 로그로 저장합니다
                    </p>
                  </div>
                </div>

                {loggingEnabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="logging-bucket">S3 버킷</Label>
                      <Select
                        value={loggingBucket}
                        onValueChange={setLoggingBucket}
                      >
                        <SelectTrigger id="logging-bucket" className="max-w-md">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="log-prefix">로그 접두사 (선택)</Label>
                      <Input
                        id="log-prefix"
                        placeholder="cloudfront-logs/"
                        value={logPrefix}
                        onChange={(e) => setLogPrefix(e.target.value)}
                        className="max-w-md"
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

      {/* WAF */}
      <Accordion type="single" collapsible>
        <AccordionItem value="waf" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="text-left">
              <div className="font-semibold">AWS WAF 웹 ACL</div>
              <div className="text-muted-foreground text-sm">
                DDoS 방지 및 보안 규칙 적용
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionContainer title="" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    id="waf-enabled"
                    checked={wafEnabled}
                    onCheckedChange={setWafEnabled}
                  />
                  <div className="flex-1">
                    <Label htmlFor="waf-enabled">WAF 활성화</Label>
                    <p className="text-muted-foreground text-sm">
                      웹 애플리케이션 방화벽으로 배포 보호
                    </p>
                  </div>
                </div>

                {wafEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="web-acl-id">웹 ACL ID</Label>
                    <Input
                      id="web-acl-id"
                      placeholder="arn:aws:wafv2:us-east-1:123456789012:global/webacl/..."
                      value={webAclId}
                      onChange={(e) => setWebAclId(e.target.value)}
                    />
                    <p className="text-muted-foreground text-sm">
                      CloudFront용 WAF ACL은 us-east-1 리전에 생성되어야 합니다
                    </p>
                  </div>
                )}
              </div>
            </SectionContainer>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Review Summary */}
      <SectionContainer
        title="설정 검토"
        description="모든 단계의 설정을 확인하세요"
      >
        <div className="space-y-4">
          {/* Step 1 Summary */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-semibold">Origin 설정</span>
              </div>
            </div>
            <div className="text-muted-foreground space-y-1 text-sm">
              <div>• Origin Type: S3 버킷</div>
              <div>• Access Control: OAC (권장)</div>
            </div>
          </div>

          {/* Step 2 Summary */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-semibold">배포 설정</span>
              </div>
            </div>
            <div className="text-muted-foreground space-y-1 text-sm">
              <div>• Price Class: 북미, 유럽, 아시아</div>
              <div>• SSL/TLS: CloudFront 기본 인증서</div>
              <div>• IPv6: 활성화</div>
            </div>
          </div>

          {/* Step 3 Summary */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span className="font-semibold">캐시 및 동작</span>
              </div>
            </div>
            <div className="text-muted-foreground space-y-1 text-sm">
              <div>• Viewer Protocol: HTTPS 리디렉션</div>
              <div>• HTTP Methods: GET, HEAD (읽기 전용)</div>
              <div>• Cache Policy: CachingOptimized</div>
              <div>• Compression: 활성화</div>
            </div>
          </div>

          {/* Step 4 Summary */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-semibold">웹사이트 설정</span>
            </div>
            <div className="space-y-1 text-sm text-blue-900">
              <div className="font-semibold">
                • Default Root Object: {defaultRootObject}
              </div>
              <div>• 커스텀 오류 페이지: {errorResponses.length}개</div>
              <div>• 로깅: {loggingEnabled ? '활성화' : '비활성화'}</div>
              <div>• WAF: {wafEnabled ? '활성화' : '비활성화'}</div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start gap-2 font-semibold text-orange-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>배포 후 추가 작업</span>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-orange-900">
              <li>S3 버킷 정책을 업데이트하여 OAC 액세스 허용</li>
              <li>
                배포 상태가 &quot;Deployed&quot;로 변경될 때까지 대기 (약
                10-15분 소요)
              </li>
              <li>CloudFront 도메인 또는 CNAME으로 웹사이트 접근 테스트</li>
              <li>캐시 무효화(Invalidation)로 업데이트 즉시 반영 가능</li>
            </ul>
          </div>
        </div>
      </SectionContainer>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={onPrev} disabled={!canGoPrev}>
          이전
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">이전</Button>
          <Button size="lg" className="px-8">
            설정 저장
          </Button>
        </div>
      </div>
    </div>
  )
}
