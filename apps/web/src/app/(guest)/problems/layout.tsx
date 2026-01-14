export default function ProblemsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="mx-auto w-full max-w-5xl px-4">{children}</div>
}
