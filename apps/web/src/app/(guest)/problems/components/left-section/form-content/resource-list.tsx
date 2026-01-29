import { CheckCircle2Icon, RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const CreatedResourceList = ({
  items,
  onRollback,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]
  onRollback: (id: string) => void
}) => {
  if (items.length === 0) return null

  return (
    <div className="animate-in fade-in slide-in-from-top-2 mx-auto max-w-4xl border-t p-6 pt-4 duration-300">
      <h4 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
        <CheckCircle2Icon className="h-4 w-4 text-green-500" />
        생성 완료된 리소스 ({items.length})
      </h4>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <div>
              <div className="text-sm font-medium">
                {item.data.name || '이름 없음'}
              </div>
              <div className="text-muted-foreground text-[10px] uppercase">
                ID: {item.id.slice(0, 8)}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-destructive/20 text-destructive hover:bg-destructive/10"
              onClick={() => onRollback(item.id)}
            >
              <RotateCcwIcon className="mr-1.5 h-3 w-3" />
              롤백
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
