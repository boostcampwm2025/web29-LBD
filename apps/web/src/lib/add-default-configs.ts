import { GlobalSubmitConfig, ServiceConfig } from '../types/submitConfig.types'

function isDuplicated(arr: ServiceConfig[], item: ServiceConfig) {
  return arr.some((existingItem) => existingItem.id === item.id)
}

export function addDefaultConfigs(
  fixedOptions?: ServiceConfig[],
): GlobalSubmitConfig {
  const defaultConfigs: GlobalSubmitConfig = {}
  if (fixedOptions instanceof Array && fixedOptions[0] !== undefined) {
    for (const options of fixedOptions) {
      switch (options._type) {
        case 's3':
          if (!defaultConfigs.s3) defaultConfigs.s3 = []
          if (
            !isDuplicated(
              defaultConfigs.s3.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.s3.push({
              id: options.id,
              data: options,
              isReady: true,
            })
          }
          break

        case 'cloudFront':
          if (!defaultConfigs.cloudFront) defaultConfigs.cloudFront = []
          if (
            !isDuplicated(
              defaultConfigs.cloudFront.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.cloudFront.push({
              id: options.id,
              data: options,
              isReady: true,
            })
          }
          break

        case 'ec2':
          if (!defaultConfigs.ec2) defaultConfigs.ec2 = []
          if (
            !isDuplicated(
              defaultConfigs.ec2.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.ec2.push({
              id: options.id,
              data: options,
              isReady: true,
            })
          }
          break
        case 'vpc':
          if (!defaultConfigs.vpc) defaultConfigs.vpc = []
          if (
            !isDuplicated(
              defaultConfigs.vpc.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.vpc.push({
              id: options.id,
              data: options,
              isReady: true,
            })
          }
          break

        case 'subnet':
          if (!defaultConfigs.subnet) defaultConfigs.subnet = []
          if (
            !isDuplicated(
              defaultConfigs.subnet.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.subnet.push({
              id: options.id,
              data: options,
              isReady: true,
            })
          }
          break

        case 'routeTable':
          if (!defaultConfigs.routeTable) defaultConfigs.routeTable = []
          if (
            !isDuplicated(
              defaultConfigs.routeTable.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.routeTable.push({
              id: options.id || '',
              data: options,
              isReady: true,
            })
          }
          break

        case 'internetGateway':
          if (!defaultConfigs.internetGateway)
            defaultConfigs.internetGateway = []
          if (
            !isDuplicated(
              defaultConfigs.internetGateway.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.internetGateway.push({
              id: options.id || '',
              data: options,
              isReady: true,
            })
          }
          break
        case 'natGateway':
          if (!defaultConfigs.natGateway) defaultConfigs.natGateway = []
          if (
            !isDuplicated(
              defaultConfigs.natGateway.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.natGateway.push({
              id: options.id || '',
              data: options,
              isReady: true,
            })
          }
          break

        case 'securityGroups':
          if (!defaultConfigs.securityGroups) defaultConfigs.securityGroups = []
          if (
            !isDuplicated(
              defaultConfigs.securityGroups.map((item) => item.data),
              options,
            )
          ) {
            defaultConfigs.securityGroups.push({
              id: options.id,
              data: options,
              isReady: true,
            })
          }
          break
      }
    }
  }
  return defaultConfigs
}
