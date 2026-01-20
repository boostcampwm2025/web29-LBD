import { AWS_SERVICE_REGISTRY } from '../registry/registry'

export interface IServiceMapper {
  inputSections: string[]
  serviceName: keyof typeof AWS_SERVICE_REGISTRY
  serviceTask: string
}

export const serviceMapper = ({
  serviceName,
  serviceTask,
  inputSections,
}: IServiceMapper) => {
  const service = AWS_SERVICE_REGISTRY[serviceName]
  if (!service) {
    throw new Error('service component is not found')
  }
  const page = service[serviceTask]
  if (!page) {
    throw new Error('page component is not found')
  }

  const inputSet = new Set(inputSections)
  const config = inputSections.reduce<Record<string, boolean>>(
    (acc, section) => {
      acc[section] = inputSet.has(section)
      return acc
    },
    {},
  )

  return {
    Component: page.component,
    config,
  }
}

// === 기존 코드 (주석 처리) ===
