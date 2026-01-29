export default function UnitProblemLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-[6fr_4fr] gap-6 px-4 py-6">
      {children}
    </div>
  )
}
