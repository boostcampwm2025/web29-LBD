import { ProblemTagBadge } from '../../../(list)/components/problem-tag-badge'
import { LayersIcon } from 'lucide-react'

interface UnitProblemHeaderProps {
  title: string
  descDetail: string
  tags: string[]
}

export function UnitProblemHeader({
  title,
  descDetail,
  tags,
}: UnitProblemHeaderProps) {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex flex-col gap-2 pl-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <LayersIcon className="bg-primary text-primary-foreground h-7 w-7 rounded-full p-1.5" />
          {title}
        </h1>
        <p className="text-muted-foreground">{descDetail}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <ProblemTagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  )
}
