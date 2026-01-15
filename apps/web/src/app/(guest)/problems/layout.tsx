import { ProblemProvider } from './provider'

export default function ProblemsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProblemProvider>
      <div className="mx-auto w-full max-w-5xl px-4">{children}</div>
    </ProblemProvider>
  )
}
