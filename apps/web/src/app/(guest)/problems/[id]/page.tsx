import { DynamicServiceRenderer } from '@/components/dynamic-service-renderer'
import { TServiceConfigMap } from '@/constants/config-map'

interface ProblemDetailPageProps {
  params: {
    id: number
  }
}

export default async function ProblemDetailPage({
  params,
}: ProblemDetailPageProps) {
  const { id } = await params
  const response = (await fetch(
    `http://localhost:3000/api/problems/${id}`,
  ).then((r) => r.json())) as TServiceConfigMap

  return <DynamicServiceRenderer config={response} />
}
