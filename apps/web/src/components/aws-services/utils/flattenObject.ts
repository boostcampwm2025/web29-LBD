import type { S3SubmitConfig } from '@/types/aws-services/s3/bucket-create'

type S3FormData = Record<string, unknown>

export function flattenObject(obj: S3FormData): S3SubmitConfig {
  // 초기 객체 생성 (_type으로 discriminator 설정)
  const result = { _type: 's3' } as S3SubmitConfig

  // 1. 첫 번째 레벨의 섹션들을 순회 (general, ownership, encryption 등)
  Object.entries(obj).forEach(([sectionKey, sectionValue]) => {
    // 값이 존재하지 않거나 null이면 스킵
    if (!sectionValue) return

    // 2. tags는 배열이므로 평탄화하지 않고 그대로 할당
    if (sectionKey === 'tags' && Array.isArray(sectionValue)) {
      result.tags = sectionValue as Array<{ key: string; value: string }>
      return
    }

    // 3. 내부 객체 순회 (재귀 대신 2단계 깊이이므로 직접 순회)
    if (typeof sectionValue === 'object') {
      Object.entries(sectionValue as Record<string, unknown>).forEach(
        ([k, v]) => {
          // 특수 케이스 처리: encryption.type -> encryptionType
          if (sectionKey === 'encryption' && k === 'type') {
            result.encryptionType = v as 'sse-s3' | 'sse-kms'
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(result as any)[k] = v
          }
        },
      )
    }
  })

  return result
}
