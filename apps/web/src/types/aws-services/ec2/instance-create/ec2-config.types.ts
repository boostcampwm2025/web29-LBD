import type { EC2InstanceCreateConfig } from './constants'
import type { EC2InstanceFormData } from './ec2-form-data.types'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type EC2InstanceCreateTypes = AwsServiceSectionTypes<
  EC2InstanceFormData,
  EC2InstanceCreateConfig
>

export type EC2SectionProps = EC2InstanceCreateTypes['SectionProps']
export type EC2WithSetValueSectionProps =
  EC2InstanceCreateTypes['WithSetValueProps']
