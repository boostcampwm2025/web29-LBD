import { AlertCircle } from 'lucide-react'

import { useFieldArray } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CloudFrontSettingsWithSetValueSectionProps } from '@/types/aws-services/cloudfront/distribution-settings'

export function CnameSection({
  control,
}: CloudFrontSettingsWithSetValueSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cnames' as never,
  })

  return (
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
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="www.example.com"
                    {...control.register(`cnames.${index}` as never)}
                    className="flex-1"
                  />
                  {fields.length > 1 && (
                    <Button variant="outline" onClick={() => remove(index)}>
                      제거
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={() => append('' as never)}>
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
  )
}
