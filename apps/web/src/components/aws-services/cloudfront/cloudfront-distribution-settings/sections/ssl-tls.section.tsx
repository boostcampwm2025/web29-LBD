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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CloudFrontSettingsSectionProps } from '@/types/aws-services/cloudfront/distribution-settings'

export function SslTlsSection({ control }: CloudFrontSettingsSectionProps) {
  const sslCertificate = useWatch({ control, name: 'sslCertificate' })

  return (
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
              <Controller
                name="sslCertificate"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="cloudfront"
                        id="ssl-cloudfront"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="ssl-cloudfront"
                          className="font-semibold"
                        >
                          CloudFront 기본 SSL/TLS 인증서
                        </Label>
                        <p className="text-muted-foreground mt-1 text-sm">
                          *.cloudfront.net 도메인에 대한 무료 인증서 제공
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="acm"
                        id="ssl-acm"
                        className="mt-1"
                      />
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
                              <Controller
                                name="acmCertificateArn"
                                control={control}
                                render={({ field: arnField }) => (
                                  <Input
                                    {...arnField}
                                    id="acm-arn"
                                    placeholder="arn:aws:acm:us-east-1:123456789012:certificate/..."
                                  />
                                )}
                              />
                              <p className="text-muted-foreground text-sm">
                                CloudFront용 인증서는 반드시 us-east-1 리전에
                                있어야 합니다
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>최소 SSL/TLS 프로토콜 버전</Label>
                              <Controller
                                name="minTlsVersion"
                                control={control}
                                render={({ field: tlsField }) => (
                                  <Select
                                    value={tlsField.value}
                                    onValueChange={tlsField.onChange}
                                  >
                                    <SelectTrigger className="max-w-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="TLSv1">
                                        TLSv1
                                      </SelectItem>
                                      <SelectItem value="TLSv1.1">
                                        TLSv1.1
                                      </SelectItem>
                                      <SelectItem value="TLSv1.2">
                                        TLSv1.2 (권장)
                                      </SelectItem>
                                      <SelectItem value="TLSv1.3">
                                        TLSv1.3
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
