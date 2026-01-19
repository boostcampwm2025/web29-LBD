export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="mx-auto w-full max-w-7xl px-4">{children}</div>
}
