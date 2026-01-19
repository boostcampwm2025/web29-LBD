import type { CloudFrontOriginWithSetValueSectionProps } from '../types'

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

export function CustomHeadersSection({
  control,
}: CloudFrontOriginWithSetValueSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customHeaders',
  })

  return (
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
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="Header Name"
                    {...control.register(`customHeaders.${index}.key`)}
                  />
                  <Input
                    placeholder="Header Value"
                    {...control.register(`customHeaders.${index}.value`)}
                  />
                  <Button variant="outline" onClick={() => remove(index)}>
                    제거
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => append({ key: '', value: '' })}
              >
                헤더 추가
              </Button>
            </div>
          </SectionContainer>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
