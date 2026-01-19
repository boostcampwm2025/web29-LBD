import { ProblemProvider } from './provider'

export default function ProblemsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProblemProvider>
      <div className="mx-auto w-full max-w-7xl px-4">{children}</div>
    </ProblemProvider>
  )
}
