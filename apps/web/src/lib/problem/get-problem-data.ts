import { mockDiagramData } from './mock-diagram-data'

import { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import type { DiagramData } from '@/types/diagram'

interface RequiredField {
  service: string
  service_task: string
  service_sections: string[]
  // fixed_options?: Record<string, string>
}

export interface ProblemData {
  serviceMappers: IServiceMapper[]
  diagram: DiagramData
}

export async function getProblemData(id: string): Promise<ProblemData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000'

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  }

  const res = await fetch(`${baseUrl}/api/problems/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('문제 상세 조회 실패')
  }

  const response = await res.json()

  const serviceMappers: IServiceMapper[] = response.required_fields.map(
    (field: RequiredField) => ({
      serviceName: field.service,
      serviceTask: field.service_task,
      inputSections: field.service_sections,
    }),
  )

  // Backend에서 diagram_template 반환 시 아래 코드로 대체
  // const diagram: DiagramData = response.diagram_template ?? mockDiagramData
  const diagram: DiagramData = mockDiagramData

  return { serviceMappers, diagram }
}
