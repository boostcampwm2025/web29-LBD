import ProblemDetailClient from './problem-detail-client'

import { getProblemData } from '@/lib/problem/get-problem-data'

interface ProblemDetailPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    type?: string
  }>
}

const mockFeedbackMessages = [
  {
    service: 'S3',
    field: '',
    message:
      '버킷 이름은 전역적으로 고유해야 합니다. 다른 이름을 시도해 주세요.',
  },
  {
    service: 'S3',
    field: 'blockPublicAccess',
    message:
      '퍼블릭 액세스 차단 설정이 권장됩니다. 보안 위험을 줄이기 위해 모든 퍼블릭 액세스를 차단하는 것이 좋습니다.',
  },
  {
    service: 'S3',
    field: 'encryption',
    message:
      '버킷 암호화를 활성화하여 저장된 데이터를 보호하는 것이 좋습니다. SSE-S3 또는 SSE-KMS를 사용하는 것을 고려해 보세요.',
  },
]

export default async function ProblemDetailPage({
  params,
  searchParams,
}: ProblemDetailPageProps) {
  const { id } = await params
  const { type: _type } = await searchParams

  const { serviceMappers, diagram } = await getProblemData(id)

  return (
    <ProblemDetailClient
      problemId={id}
      problemData={serviceMappers}
      diagramData={diagram}
      initialFeedback={mockFeedbackMessages}
    />
  )
}
