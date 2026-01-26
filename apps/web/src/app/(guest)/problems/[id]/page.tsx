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

export default async function ProblemDetailPage({
  params,
  searchParams,
}: ProblemDetailPageProps) {
  const { id } = await params
  const { type: _type } = await searchParams

  const { title, description, tags, serviceMappers, diagram } =
    await getProblemData(id)

  const mockFeedbackMessages = [
    {
      service: 'mockservice',
      field: 'mockfield',
      message: 'mockMessage',
    },
  ]

  return (
    <ProblemDetailClient
      problemId={id}
      title={title}
      description={description}
      tags={tags}
      problemData={serviceMappers}
      diagramData={diagram}
      initialFeedback={mockFeedbackMessages}
    />
  )
}
