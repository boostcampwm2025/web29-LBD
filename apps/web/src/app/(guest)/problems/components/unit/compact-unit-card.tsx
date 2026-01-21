import { Badge } from '@/components/ui/badge'
import { UnitProblem } from '@/types/problem.type'

interface CompactUnitCardProps extends UnitProblem {
  step: number
}

export const CompactUnitCard = ({
  step,
  title,
  description,
}: CompactUnitCardProps) => {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-1.5">
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono text-sm tabular-nums">
          {step}
        </Badge>
        <p className="text-base font-semibold">{title}</p>
      </div>

      <p className="text-muted-foreground pt-2 text-sm">{description}</p>
    </div>
  )
}
