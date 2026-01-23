import { Button } from '@/components/ui/button'

interface SelectionInfoSectionProps {
  selectedCount: number
  onClearSelection: () => void
  onDisable?: () => void
  onDelete?: () => void
}

export function SelectionInfoSection({
  selectedCount,
  onClearSelection,
  onDisable,
  onDelete,
}: SelectionInfoSectionProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-2">
      <p className="text-sm">
        <span className="font-semibold">{selectedCount}</span>개 선택됨
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          선택 해제
        </Button>
        <Button variant="outline" size="sm" onClick={onDisable}>
          비활성화
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          삭제
        </Button>
      </div>
    </div>
  )
}
