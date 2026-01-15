import { AWS_SERVICE_REGISTRY } from '../registry/registry'

export interface IServiceMapper {
  input_sections: string[]
  serviceName: keyof typeof AWS_SERVICE_REGISTRY
  service_task: 'bucket-create'
}

export const serviceMapper = ({
  serviceName,
  service_task,
  input_sections,
}: IServiceMapper) => {
  const service = AWS_SERVICE_REGISTRY[serviceName]
  if (!service) {
    throw new Error('service component is not found')
  }
  const page = service[service_task]
  if (!page) {
    throw new Error('page component is not found')
  }

  const inputSet = new Set(input_sections)
  const config = input_sections.reduce<Record<string, boolean>>(
    (acc, section) => {
      acc[section] = inputSet.has(section)
      return acc
    },
    {},
  )

  return {
    Component: page,
    config,
  }
}

// === 기존 코드 (주석 처리) ===
