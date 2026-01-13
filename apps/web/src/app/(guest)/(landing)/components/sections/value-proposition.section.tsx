export const ValuePropositionSection = () => {
  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">왜 클라우드 크래프트인가요?</h2>
        <p className="text-muted-foreground mt-4 text-lg">
          안전하고 효과적인 학습 환경을 제공합니다
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Card 1: 비용 걱정 없음 */}
        <div className="border-border bg-card flex flex-col items-center rounded-lg border p-8 text-center shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold">비용 걱정 없이</h3>
          <p className="text-muted-foreground">
            실제 AWS 요금 폭탄을 맞을 걱정 없이 마음껏 실습하세요. 시뮬레이션
            환경에서 무제한으로 연습할 수 있습니다.
          </p>
        </div>

        {/* Card 2: 실수 두려움 없음 */}
        <div className="border-border bg-card flex flex-col items-center rounded-lg border p-8 text-center shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold">안전한 학습 환경</h3>
          <p className="text-muted-foreground">
            잘못된 설정으로 인한 보안 사고나 데이터 손실 걱정 없이 안심하고
            학습하세요. 샌드박스 환경에서 자유롭게 실험할 수 있습니다.
          </p>
        </div>

        {/* Card 3: 시각화 학습 */}
        <div className="border-border bg-card flex flex-col items-center rounded-lg border p-8 text-center shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <svg
              className="h-8 w-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold">시각화된 다이어그램</h3>
          <p className="text-muted-foreground">
            복잡한 AWS 아키텍처를 직관적인 다이어그램으로 확인하며 학습하세요.
            인프라 구성을 한눈에 이해할 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  )
}
