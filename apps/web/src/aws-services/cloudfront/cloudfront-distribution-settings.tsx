'use client'

import { AlertCircle, Info } from 'lucide-react'

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

interface CloudFrontDistributionSettingsProps {
  onNext: () => void
  onPrev: () => void
  canGoPrev: boolean
}

export default function CloudFrontDistributionSettings({
  onNext,
  onPrev,
  canGoPrev,
}: CloudFrontDistributionSettingsProps) {
  // 일반 구성
  const [distributionName, setDistributionName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [enabled, setEnabled] = React.useState(true)

  // Price Class
  const [priceClass, setPriceClass] = React.useState('performance')

  // CNAME
  const [cnames, setCnames] = React.useState<string[]>([''])

  const addCname = () => {
    setCnames([...cnames, ''])
  }

  const updateCname = (index: number, value: string) => {
    const updated = [...cnames]
    updated[index] = value
    setCnames(updated)
  }

  const removeCname = (index: number) => {
    setCnames(cnames.filter((_, i) => i !== index))
  }

  // SSL/TLS
  const [sslCertificate, setSslCertificate] = React.useState('cloudfront')
  const [acmCertificateArn, setAcmCertificateArn] = React.useState('')

  // IPv6
  const [ipv6Enabled, setIpv6Enabled] = React.useState(true)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">배포 설정</h2>
        <p className="text-muted-foreground">
          CloudFront 배포의 기본 설정을 구성하세요
        </p>
      </div>

      {/* 일반 구성 */}
      <SectionContainer
        title="일반 구성"
        description="배포의 기본 정보를 입력하세요"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dist-name">배포 이름 (선택)</Label>
            <Input
              id="dist-name"
              placeholder="my-cloudfront-distribution"
              className="max-w-md"
              value={distributionName}
              onChange={(e) => setDistributionName(e.target.value)}
            />
            <p className="text-muted-foreground text-sm">
              배포를 식별하기 쉬운 이름을 입력하세요
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dist-description">설명 (선택)</Label>
            <Input
              id="dist-description"
              placeholder="정적 웹사이트용 CDN 배포"
              className="max-w-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="dist-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <div className="flex-1">
              <Label htmlFor="dist-enabled">배포 생성 후 즉시 활성화</Label>
              <p className="text-muted-foreground text-sm">
                비활성화 시 배포가 생성되지만 트래픽은 처리되지 않습니다
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>

      <Separator />

      {/* Price Class */}
      <SectionContainer
        title="Price Class"
        description="배포에 사용할 엣지 로케이션 범위를 선택하세요"
      >
        <div className="space-y-4">
          <RadioGroup value={priceClass} onValueChange={setPriceClass}>
            {/* 모든 엣지 로케이션 */}
            <div className="flex items-start gap-3">
              <RadioGroupItem value="all" id="price-all" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="price-all" className="font-semibold">
                  모든 엣지 로케이션 사용
                </Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  최고 성능 | 비용: 높음 | 전세계 모든 CloudFront 엣지 로케이션
                  사용
                </p>
              </div>
            </div>

            {/* 북미, 유럽, 아시아 */}
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

            {/* 북미, 유럽만 */}
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
                  비용 최적화 | 비용: 낮음 | 북미와 유럽 사용자만 대상으로 하는
                  경우
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="text-muted-foreground bg-muted/50 flex items-start gap-2 rounded-md p-3 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Price Class는 배포 생성 후에도 변경할 수 있습니다. 트래픽 패턴을
              확인한 후 최적화하세요.
            </p>
          </div>
        </div>
      </SectionContainer>

      <Separator />

      {/* 대체 도메인 (CNAME) - Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="cname" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="text-left">
              <div className="font-semibold">대체 도메인 이름 (CNAME)</div>
              <div className="text-muted-foreground text-sm">
                CloudFront 도메인 대신 사용할 커스텀 도메인 추가
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionContainer title="" className="mt-4">
              <div className="space-y-3">
                {cnames.map((cname, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="www.example.com"
                      value={cname}
                      onChange={(e) => updateCname(index, e.target.value)}
                      className="flex-1"
                    />
                    {cnames.length > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => removeCname(index)}
                      >
                        제거
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addCname}>
                  도메인 추가
                </Button>

                <div className="flex items-start gap-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    대체 도메인을 사용하려면 해당 도메인의 SSL/TLS 인증서가
                    필요합니다. 아래 SSL/TLS 인증서 섹션에서 ACM 인증서를
                    선택하세요.
                  </p>
                </div>
              </div>
            </SectionContainer>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* SSL/TLS 인증서 - Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="ssl" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="text-left">
              <div className="font-semibold">SSL/TLS 인증서</div>
              <div className="text-muted-foreground text-sm">
                HTTPS 연결을 위한 인증서 설정
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionContainer title="" className="mt-4">
              <div className="space-y-4">
                <RadioGroup
                  value={sslCertificate}
                  onValueChange={setSslCertificate}
                >
                  {/* CloudFront 기본 인증서 */}
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value="cloudfront"
                      id="ssl-cloudfront"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="ssl-cloudfront" className="font-semibold">
                        CloudFront 기본 SSL/TLS 인증서
                      </Label>
                      <p className="text-muted-foreground mt-1 text-sm">
                        *.cloudfront.net 도메인에 대한 무료 인증서 제공
                      </p>
                    </div>
                  </div>

                  {/* ACM 커스텀 인증서 */}
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="acm" id="ssl-acm" className="mt-1" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor="ssl-acm" className="font-semibold">
                          커스텀 SSL/TLS 인증서 (ACM)
                        </Label>
                        <p className="text-muted-foreground mt-1 text-sm">
                          대체 도메인 이름을 사용하는 경우 필수
                        </p>
                      </div>
                      {sslCertificate === 'acm' && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="acm-arn">ACM 인증서 ARN</Label>
                            <Input
                              id="acm-arn"
                              placeholder="arn:aws:acm:us-east-1:123456789012:certificate/..."
                              value={acmCertificateArn}
                              onChange={(e) =>
                                setAcmCertificateArn(e.target.value)
                              }
                            />
                            <p className="text-muted-foreground text-sm">
                              CloudFront용 인증서는 반드시 us-east-1 리전에
                              있어야 합니다
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label>최소 SSL/TLS 프로토콜 버전</Label>
                            <Select defaultValue="TLSv1.2">
                              <SelectTrigger className="max-w-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TLSv1">TLSv1</SelectItem>
                                <SelectItem value="TLSv1.1">TLSv1.1</SelectItem>
                                <SelectItem value="TLSv1.2">
                                  TLSv1.2 (권장)
                                </SelectItem>
                                <SelectItem value="TLSv1.3">TLSv1.3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </SectionContainer>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* IPv6 지원 */}
      <SectionContainer title="네트워크" description="IPv6 지원 설정">
        <div className="flex items-center gap-3">
          <Switch
            id="ipv6-enabled"
            checked={ipv6Enabled}
            onCheckedChange={setIpv6Enabled}
          />
          <div className="flex-1">
            <Label htmlFor="ipv6-enabled">IPv6 활성화</Label>
            <p className="text-muted-foreground text-sm">
              IPv6을 지원하는 클라이언트가 배포에 연결할 수 있도록 허용합니다
              (권장)
            </p>
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
          <Button onClick={onNext}>다음 단계</Button>
        </div>
      </div>
    </div>
  )
}
