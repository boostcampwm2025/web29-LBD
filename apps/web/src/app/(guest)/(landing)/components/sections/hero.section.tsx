import Link from 'next/link'

import AwsDiagram from '@/components/aws-diagram'
import { AppSquareIcon } from '@/components/icons/app-square.icon'
import { Button } from '@/components/ui/button'

export const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 gap-8 py-16 lg:grid-cols-2 lg:items-center">
      <div>
        <AppSquareIcon width={100} height={100} />
        <p className="mt-8 text-3xl font-bold">AWS를 실전처럼 학습하세요</p>
        <p className="text-muted-foreground mt-6 text-lg">
          실제 AWS 환경을 시뮬레이션하여 클라우드 인프라를 직접 구축하고
          설정해보세요. <br /> 안전한 샌드박스 환경에서 실습하며 배우는 가장
          효과적인 클라우드 학습 플랫폼입니다.
        </p>

        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link href="/problems">문제 풀기 시작하기</Link>
          </Button>
        </div>
      </div>
      <div id="xyflow">
        <AwsDiagram />
      </div>
    </section>
  )
}
