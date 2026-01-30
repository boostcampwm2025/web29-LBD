export default function UnitProblemLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid w-full grid-cols-[4fr_6fr] gap-6 px-4 py-6">
      {children}
    </div>
  )
}
