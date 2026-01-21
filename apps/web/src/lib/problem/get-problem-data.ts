import { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'

interface RequiredField {
  service: string
  service_task: string
  service_sections: string[]
  // fixed_options?: Record<string, string>
}

export async function getProblemData(id: string): Promise<IServiceMapper[]> {
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

  const problemData: IServiceMapper[] = response.required_fields.map(
    (field: RequiredField) => ({
      serviceName: field.service,
      serviceTask: field.service_task,
      inputSections: field.service_sections,
    }),
  )

  return problemData
}
