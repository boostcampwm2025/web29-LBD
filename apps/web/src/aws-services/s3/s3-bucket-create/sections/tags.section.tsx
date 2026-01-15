import type { S3SectionProps } from '../types'

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

export const Tags = ({ control: _control }: S3SectionProps) => {
  return (
    <SectionContainer
      title="태그 - 선택 사항"
      description="버킷을 구성하고 분류하기 위해 태그를 추가하세요"
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="tags" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            태그 추가 (0)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-key">키</Label>
                  <Input id="tag-key" placeholder="Environment" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag-value">값</Label>
                  <Input id="tag-value" placeholder="Production" disabled />
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                태그 추가
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SectionContainer>
  )
}
