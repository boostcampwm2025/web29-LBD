interface ProblemHeaderProps {
  title: string
  description: string
  tags?: string[]
}

export function ProblemHeader({
  title,
  description,
  tags,
}: ProblemHeaderProps) {
  return (
    <div className="bg-card space-y-4 rounded-lg border p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-muted rounded-full px-3 py-1 text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
