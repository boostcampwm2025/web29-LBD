interface FooterInfoSectionProps {
  totalCount: number
  searchQuery?: string
}

export function FooterInfoSection({
  totalCount,
  searchQuery,
}: FooterInfoSectionProps) {
  return (
    <div className="text-muted-foreground flex items-center justify-between text-sm">
      <p>총 {totalCount}개의 배포</p>
      {searchQuery && (
        <p>
          &quot;{searchQuery}&quot; 검색 결과: {totalCount}개
        </p>
      )}
    </div>
  )
}
