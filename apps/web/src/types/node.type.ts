import {
  AwsGroupNode,
  AwsResourceNode,
  AwsServiceNode,
} from '../components/diagram/nodes'

export const awsNodeTypes = {
  awsService: AwsServiceNode,
  awsResource: AwsResourceNode,
  awsGroup: AwsGroupNode,
}

export type AwsNodeType = keyof typeof awsNodeTypes
