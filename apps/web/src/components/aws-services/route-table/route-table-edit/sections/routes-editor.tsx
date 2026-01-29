'use client'

import { Plus, Trash2 } from 'lucide-react'

import { useFieldArray, useFormContext } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { RouteTableEditFormData } from '@/types/aws-services/route-table/route-table.types'

export function RoutesEditor() {
  // 메인 폼의 컨텍스트를 가져옴
  const { control, register } = useFormContext<RouteTableEditFormData>()

  // 동적 필드 배열 관리
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'routes',
  })

  return (
    <SectionContainer
      title="라우트 (Routes)"
      description="트래픽이 향할 대상을 결정합니다. 가장 구체적인 라우트가 우선순위를 갖습니다."
    >
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[45%]">대상 (Destination)</TableHead>
              <TableHead className="w-[45%]">타겟 (Target)</TableHead>
              <TableHead className="w-[10%] text-right">삭제</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              // local 라우트는 수정/삭제 불가 처리
              const isLocal = field.targetGatewayId === 'local'

              return (
                <TableRow key={field.id}>
                  <TableCell>
                    <Input
                      {...register(`routes.${index}.destinationCidr`)}
                      disabled={isLocal}
                      className={
                        isLocal ? 'bg-muted text-muted-foreground' : ''
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      {...register(`routes.${index}.targetGatewayId`)}
                      disabled={isLocal}
                      className={
                        isLocal ? 'bg-muted text-muted-foreground' : ''
                      }
                      placeholder="예: igw-xxxxx, nat-xxxxx"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {!isLocal && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {isLocal && (
                      <span className="text-muted-foreground px-2 text-xs">
                        기본
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ destinationCidr: '', targetGatewayId: '' })}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> 라우트 추가
        </Button>
      </div>
    </SectionContainer>
  )
}
