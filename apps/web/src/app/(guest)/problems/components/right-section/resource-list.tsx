/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { CheckCircle2Icon, RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'

export const CreatedResourcePanel = () => {
  const { submitConfig, handleRemoveItem } = useProblemForm()

  const totalCount = Object.values(submitConfig).reduce(
    (acc, items) => acc + (items?.length ?? 0),
    0,
  )

  return (
    <div className="rounded-lg border p-4">
      <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
        <CheckCircle2Icon className="h-4 w-4 text-green-500" />
        생성된 리소스 ({totalCount}개)
      </h4>
      {Object.entries(submitConfig).map(([serviceType, items]) => (
        <CreatedResourceList
          key={serviceType}
          items={items}
          onRollback={(id) => handleRemoveItem(serviceType as any, id)}
        />
      ))}
    </div>
  )
}

const CreatedResourceList = ({
  items,
  onRollback,
}: {
  items: any[]
  onRollback: (id: string) => void
}) => {
  if (items.length === 0) return null

  return (
    <div className="mt-3 grid gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition-colors"
        >
          <div>
            <div className="text-sm font-medium">
              {item.data.name || '이름없음'}
            </div>
            <div className="text-muted-foreground text-[10px] uppercase">
              ID: {item.id.slice(0, 8)}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRollback(item.id)}
          >
            <RotateCcwIcon className="mr-1.5 h-3 w-3" />
            취소
          </Button>
        </div>
      ))}
    </div>
  )
}
