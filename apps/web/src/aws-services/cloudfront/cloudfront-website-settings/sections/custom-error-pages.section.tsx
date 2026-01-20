import type { CloudFrontWebsiteWithSetValueSectionProps } from '../types'
import { Info } from 'lucide-react'

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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CustomErrorPagesSection({
  control,
}: CloudFrontWebsiteWithSetValueSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'errorResponses',
  })

  return (
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
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HTTP 오류 코드</Label>
                      <Select
                        value={control._getWatch(
                          `errorResponses.${index}.errorCode`,
                        )}
                        onValueChange={(value) =>
                          control._formValues &&
                          (control._formValues.errorResponses[index].errorCode =
                            value)
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
                        {...control.register(
                          `errorResponses.${index}.responsePagePath`,
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>응답 코드</Label>
                      <Input
                        placeholder="200"
                        {...control.register(
                          `errorResponses.${index}.responseCode`,
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>오류 캐싱 최소 TTL (초)</Label>
                      <Input
                        type="number"
                        placeholder="300"
                        {...control.register(`errorResponses.${index}.ttl`)}
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    제거
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  append({
                    errorCode: '404',
                    responsePagePath: '/404.html',
                    responseCode: '404',
                    ttl: '300',
                  })
                }
              >
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
  )
}
