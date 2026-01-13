import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

export const HowItWorksSection = () => {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">어떻게 작동하나요?</h2>
        <p className="text-muted-foreground mt-4 text-lg">
          세 가지 유형의 문제로 AWS를 마스터하세요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left: Diagram Placeholder */}
        <div className="order-2 lg:order-1">
          <div className="border-border bg-card rounded-lg border-2 border-dashed p-12">
            <div className="text-muted-foreground flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">📊</div>
                <p className="text-lg">문제 유형별 시각화</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tabs Content */}
        <div className="order-1 lg:order-2">
          <Tabs defaultValue="cookbook" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cookbook">Cookbook</TabsTrigger>
              <TabsTrigger value="unit">Unit</TabsTrigger>
              <TabsTrigger value="scenario">Scenario</TabsTrigger>
            </TabsList>

            <TabsContent value="cookbook" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <span className="text-2xl">📖</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Cookbook</h3>
                </div>
                <p className="text-foreground text-lg leading-relaxed">
                  레시피에 따라 실제 문제를 해결합니다. 웹 서버 배포,
                  데이터베이스 연동, 로드 밸런싱 구성 등 실무에서 자주 마주치는
                  시나리오를 단계별로 학습합니다. 정해진 순서대로 따라하며 실전
                  감각을 익힙니다.
                </p>
                <div className="mt-4 rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-900">
                    예시: {'"'}3-tier 웹 애플리케이션을 구축하세요: ALB → EC2
                    (웹 서버) → RDS (데이터베이스){'"'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="unit" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Unit</h3>
                </div>
                <p className="text-foreground text-lg leading-relaxed">
                  단순 서비스 설정 문제입니다. EC2 인스턴스 생성, VPC 구성, 보안
                  그룹 설정 등 개별 AWS 서비스의 기본 설정을 학습합니다.
                  초보자가 AWS의 핵심 개념을 익히기에 적합합니다.
                </p>
                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">
                    예시: {'"'}ap-northeast-2 리전에 t2.micro 인스턴스를
                    생성하고 SSH 접속을 허용하는 보안 그룹을 설정하세요.{'"'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scenario" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Scenario</h3>
                </div>
                <p className="text-foreground text-lg leading-relaxed">
                  정답이 정해져 있지 않은 검증 문제입니다. 비용 최적화, 성능
                  개선, 보안 강화 등 실제 업무에서 마주하는 복잡한 상황을
                  해결합니다. 여러 해결 방법 중 최적의 아키텍처를 설계하는
                  능력을 키웁니다.
                </p>
                <div className="mt-4 rounded-lg bg-purple-50 p-4">
                  <p className="text-sm font-medium text-purple-900">
                    예시: {'"'}월 1000만 방문자를 처리할 수 있으면서 비용은
                    최소화한 아키텍처를 설계하세요.{'"'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
