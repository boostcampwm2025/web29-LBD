import { Button } from '@/components/ui/button'

interface EmptyStateSectionProps {
  onCreateBucket: () => void
}

export const EmptyStateSection = ({
  onCreateBucket,
}: EmptyStateSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-muted-foreground mb-6 text-center">
        <h3 className="mb-2 text-lg font-semibold">버킷이 없습니다</h3>
        <p className="text-sm">버킷을 생성하여 객체를 저장하고 관리하세요.</p>
      </div>
      <Button onClick={onCreateBucket}>버킷 생성</Button>
    </div>
  )
}
