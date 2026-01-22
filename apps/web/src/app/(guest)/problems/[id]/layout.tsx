export default function ProblemDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>
}
