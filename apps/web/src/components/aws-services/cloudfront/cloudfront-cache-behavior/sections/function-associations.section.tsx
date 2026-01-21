import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CloudFrontCacheSectionProps } from '@/types/aws-services/cloudfront/cache-behavior'

export function FunctionAssociationsSection({
  control,
}: CloudFrontCacheSectionProps) {
  return (
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
                <Controller
                  name="viewerRequestFunction"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
                <p className="text-muted-foreground text-sm">
                  뷰어 요청을 받은 직후 실행됩니다
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="viewer-response-function">
                  Viewer Response Function
                </Label>
                <Controller
                  name="viewerResponseFunction"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
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
  )
}
