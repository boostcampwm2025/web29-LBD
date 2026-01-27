import type { IServiceMapper } from '../utils/serviceMapper'
import { AWS_SERVICE_REGISTRY } from './registry'

import type { FieldValues } from 'react-hook-form'

/**
 * 단일 서비스의 기본값을 조회합니다.
 */
export function getServiceDefaultValues(
  serviceName: keyof typeof AWS_SERVICE_REGISTRY,
  serviceTask: string,
): FieldValues {
  const service = AWS_SERVICE_REGISTRY[serviceName]
  if (!service) {
    return {}
  }

  const page = service[serviceTask]
  if (!page) {
    return {}
  }

  return page.defaultValues
}

/**
 * 서비스 키 생성 함수 (서비스명_태스크명 형식)
 */
export function createServiceKey(
  serviceName: string,
  serviceTask: string,
): string {
  return `${serviceName}_${serviceTask}`
}

/**
 * 여러 서비스의 기본값을 병합하여 반환합니다.
 * 복합 문제(예: S3 + CloudFront)를 지원합니다.
 *
 * @param mappers - 서비스 매퍼 배열
 * @returns 병합된 기본값 객체 (서비스명_태스크명을 키로 사용)
 *
 * @example
 * // 단일 서비스
 * mergeServiceDefaultValues([{ serviceName: 'S3', serviceTask: 'bucket-create', ... }])
 * // => { S3_bucket-create: { general: {...}, ... } }
 *
 * @example
 * // 복합 서비스
 * mergeServiceDefaultValues([
 *   { serviceName: 'S3', serviceTask: 'bucket-create', ... },
 *   { serviceName: 'CloudFront', serviceTask: 'origin-settings', ... }
 * ])
 * // => { S3_bucket-create: {...}, CloudFront_origin-settings: {...} }
 */
export function mergeServiceDefaultValues(
  mappers: IServiceMapper[],
): FieldValues {
  return mappers.reduce<FieldValues>((acc, mapper) => {
    const key = createServiceKey(mapper.serviceName, mapper.serviceTask)
    const defaultValues = getServiceDefaultValues(
      mapper.serviceName,
      mapper.serviceTask,
    )

    return {
      ...acc,
      [key]: defaultValues,
    }
  }, {})
}

/**
 * 단일 서비스용 기본값을 반환합니다.
 * 서비스가 하나만 있을 경우 중첩 없이 바로 기본값을 반환합니다.
 *
 * @param mapper - 단일 서비스 매퍼
 * @returns 해당 서비스의 기본값
 */
export function getSingleServiceDefaultValues(
  mapper: IServiceMapper,
): FieldValues {
  return getServiceDefaultValues(mapper.serviceName, mapper.serviceTask)
}
