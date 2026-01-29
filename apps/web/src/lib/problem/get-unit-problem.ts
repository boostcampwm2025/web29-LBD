import { addDefaultConfigs } from '../add-default-configs'

import { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { GlobalSubmitConfig, ServiceConfig } from '@/types/submitConfig.types'

/*
  2026-01-26 17:02
  Kim Y.J.의 변경.
  통일된 DTO 네이밍 컨벤선에 따라 필드 값 이름 변경.
*/

interface RequiredField {
  serviceName: string
  serviceTask: string
  serviceSections: string[]
  fixedOptions?: Record<string, string>[]
}

interface ProblemData {
  problemType: string
  title: string
  descDetail: string
  tags: string[]
  serviceMappers: IServiceMapper[]
  defaultConfigs: GlobalSubmitConfig
}

export async function getUnitProblemDataById(id: string): Promise<ProblemData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  }

  const res = await fetch(`${baseUrl}/api/problems/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('유닛 문제 상세 조회 실패')
  }

  const response = await res.json()

  const serviceMappers: IServiceMapper[] = response.requiredFields.map(
    (field: RequiredField) => ({
      serviceName: field.serviceName,
      serviceTask: field.serviceTask,
      inputSections: field.serviceSections,
    }),
  )
  const fixedOptions: ServiceConfig[] =
    response?.requiredFields?.flatMap(
      (field: RequiredField) => field.fixedOptions || [],
    ) || []
  const defaultConfigs: GlobalSubmitConfig = addDefaultConfigs(fixedOptions)

  return {
    problemType: response.problemType,
    title: response.title ?? '문제',
    descDetail: response.descDetail ?? '',
    tags: response.tags ?? [],
    serviceMappers,
    defaultConfigs,
  }
}
