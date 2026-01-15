import Link from 'next/link'

import AwsDiagram from '@/components/aws-diagram'
import { AppSquareIcon } from '@/components/icons/app-square.icon'
import { Button } from '@/components/ui/button'

export const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 gap-8 py-16 lg:grid-cols-2 lg:items-center">
      <div>
        <AppSquareIcon width={100} height={100} />
        <p className="mt-8 text-3xl leading-10 font-bold">
          시각적으로 이해하는 <br /> AWS 클라우드 인프라 학습 플랫폼
        </p>
        <p className="text-muted-foreground mt-6 text-lg">
          안전한 샌드박스 환경에서 실습하며 배우는 가장 효과적인 클라우드 학습
          플랫폼입니다.
        </p>

        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link href="/problems?type=unit">문제 풀기 시작하기</Link>
          </Button>
        </div>
      </div>

      <div id="xyflow">
        <AwsDiagram />
      </div>
    </section>
  )
}
