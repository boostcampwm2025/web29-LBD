import './globals.css'

import type { Metadata, Viewport } from 'next'

import { Footer, Header } from '@/components/layout'
import { cn } from '@/lib/utils'
import { MSWProvider } from '@/mock/msw-provider'

export const viewport: Viewport = {
  width: 'device-width',
  viewportFit: 'cover',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: '클라우드 크래프트',
  description: '시각적으로 학습하는 클라우드 시뮬레이터',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(
          'bg-background antialiased',
          'selection:bg-primary/30 selection:text-foreground',
        )}
      >
        <MSWProvider>
          <Header />
          <main className="h-full min-h-[calc(100vh)] py-20">{children}</main>
          <Footer />
        </MSWProvider>
      </body>
    </html>
  )
}
