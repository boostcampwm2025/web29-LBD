import type { EC2InstanceCreateConfig } from '@/constants/aws-services/ec2'
import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'
import type { EC2InstanceFormData } from '@/types/aws-services/ec2/instance-create'

type EC2InstanceCreateTypes = AwsServiceSectionTypes<
  EC2InstanceFormData,
  EC2InstanceCreateConfig
>

export type EC2SectionProps = EC2InstanceCreateTypes['SectionProps']
export type EC2WithSetValueSectionProps =
  EC2InstanceCreateTypes['WithSetValueProps']
