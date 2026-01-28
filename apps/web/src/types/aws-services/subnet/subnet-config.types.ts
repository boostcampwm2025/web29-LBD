import type { SubnetCreateConfig } from './constants'
import type { SubnetFormData } from './subnet-form-data.types'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type SubnetCreateTypes = AwsServiceSectionTypes<
  SubnetFormData,
  SubnetCreateConfig
>
export type SubnetSectionProps = SubnetCreateTypes['SectionProps']
export type SubnetWithSetValueSectionProps =
  SubnetCreateTypes['WithSetValueProps']
