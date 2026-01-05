import './globals.css'

import type { Metadata, Viewport } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
        <header className="mx-4 grid h-16 grid-cols-[200px_1fr] items-center justify-between px-4">
          <div>LOGO</div>

          <div className="flex gap-4 justify-self-end">
            <Button asChild variant="ghost">
              <Link href="/problems">문제</Link>
            </Button>
            <Button asChild>
              <Link href="/login">로그인하기</Link>
            </Button>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
