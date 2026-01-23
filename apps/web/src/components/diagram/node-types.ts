import { AwsGroupNode } from './nodes/aws-group-node'
import { AwsResourceNode } from './nodes/aws-resource-node'
import { AwsServiceNode } from './nodes/aws-service-node'

export const awsNodeTypes = {
  awsService: AwsServiceNode,
  awsResource: AwsResourceNode,
  awsGroup: AwsGroupNode,
}

export type AwsNodeType = keyof typeof awsNodeTypes
