import S3CloudFrontDiagram from './diagram'

export default function DiagramSamplesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          AWS 아키텍처 다이어그램 샘플
        </h1>
        <p className="text-gray-600">
          draw.io 스타일의 AWS 아키텍처 다이어그램 예시입니다.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">S3 + CloudFront CDN 구성</h2>
        <S3CloudFrontDiagram />
      </section>

      <section className="rounded-lg bg-gray-100 p-6">
        <h3 className="mb-4 text-lg font-semibold">아키텍처 구성 요소</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">서비스 (Services)</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>
                <strong>Route 53</strong> - DNS 서비스로 도메인을 CloudFront에
                연결
              </li>
              <li>
                <strong>ACM</strong> - SSL/TLS 인증서 관리
              </li>
              <li>
                <strong>CloudFront</strong> - 글로벌 CDN으로 콘텐츠 배포
              </li>
              <li>
                <strong>WAF</strong> - 웹 애플리케이션 방화벽
              </li>
              <li>
                <strong>S3</strong> - 정적 파일 저장소
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">연결선 범례</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>
                <span className="text-green-600">━━▶</span> 실선 (애니메이션) -
                데이터 흐름
              </li>
              <li>
                <span className="text-gray-500">┄┄┄</span> 점선 - 설정/프로비전
                관계
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
