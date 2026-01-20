import { TagIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

export const ProblemTagBadge = ({ tag }: { tag: string }) => {
  return (
    <Badge key={tag} variant={'secondary'} className="rounded-xl text-sm">
      <TagIcon className="h-4 w-4" />
      {tag}
    </Badge>
  )
}
