import { ProblemTagBadge } from '../../../(list)/components/problem-tag-badge'

import { Badge } from '@/components/ui/badge'

interface CookbookProblemHeaderProps {
  title: string
  description: string
  tags: string[]
  units: { id: string; title: string }[]
  currUnitId: string
}

export function CookbookProblemHeader({
  title,
  description,
  tags,
  units,
  currUnitId,
}: CookbookProblemHeaderProps) {
  const currUnitIndex = units.findIndex((unit) => unit.id === currUnitId)
  const currUnit = units[currUnitIndex]

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex flex-col gap-2 pl-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <ProblemTagBadge key={tag} tag={tag} />
        ))}
      </div>

      <div className="flex items-center gap-2 border-t pt-4">
        <Badge className="bg-primary-foreground border-primary text-primary h-5 min-w-5 rounded-full px-2 font-mono text-sm tabular-nums">
          Step {currUnitIndex + 1}
        </Badge>
        <span className="font-semibold">{currUnit.title}</span>
      </div>
    </div>
  )
}
