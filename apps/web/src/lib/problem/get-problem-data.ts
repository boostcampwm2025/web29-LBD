import { mockDiagramData } from './mock-diagram-data'

import { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { DiagramData } from '@/types/diagram.type'

/*
  2026-01-26 17:02
  Kim Y.J.의 변경.
  통일된 DTO 네이밍 컨벤선에 따라 필드 값 이름 변경.
*/

interface RequiredField {
  serviceName: string
  serviceTask: string
  serviceSections: string[]
  // fixed_options?: Record<string, string>
}

export interface ProblemData {
  problemType: string
  title: string
  description: string
  descDetail: string
  tags: string[]
  serviceMappers: IServiceMapper[]
  diagram: DiagramData
}

export async function getProblemData(id: string): Promise<ProblemData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

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

  const serviceMappers: IServiceMapper[] = response.requiredFields.map(
    (field: RequiredField) => ({
      serviceName: field.serviceName,
      serviceTask: field.serviceTask,
      inputSections: field.serviceSections,
    }),
  )

  // Backend에서 diagram_template 반환 시 아래 코드로 대체
  // const diagram: DiagramData = response.diagram_template ?? mockDiagramData
  const diagram: DiagramData = mockDiagramData

  return {
    problemType: response.problemType,
    title: response.title ?? '문제',
    description: response.description ?? '',
    descDetail: response.descDetail,
    tags: response.tags ?? [],
    serviceMappers,
    diagram,
  }
}
