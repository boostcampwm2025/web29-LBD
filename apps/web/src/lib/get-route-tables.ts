import type { GlobalSubmitConfig } from '@/types/submitConfig.types'

export function getRouteTables(defaultConfigs: GlobalSubmitConfig) {
  return defaultConfigs.routeTable || []
}
