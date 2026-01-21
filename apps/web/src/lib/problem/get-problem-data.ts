import { IServiceMapper } from '@/aws-services/utils/serviceMapper'

export async function getProblemData(id: string): Promise<IServiceMapper> {
  // TODO: 실제 API 호출로 변경
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // if (!baseUrl) {
  //   throw new Error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.')
  // }

  // const res = await fetch(`${baseUrl}/problems/${id}`, {
  //   cache: 'no-store',
  // })

  // if (!res.ok) {
  //   throw new Error('문제 데이터 조회 실패')
  // }
  //
  // return res.json()

  const result: IServiceMapper = {
    serviceName: 'S3',
    serviceTask: 'bucket-create',
    inputSections: ['general', 'ownership', 'blockPublicAccess'],
  }

  return result
}
