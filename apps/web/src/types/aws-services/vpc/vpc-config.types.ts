import type { VpcCreateConfig } from './constants'
import type { VpcFormData } from './vpc-form-data.types'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type VpcCreateTypes = AwsServiceSectionTypes<VpcFormData, VpcCreateConfig>

export type VpcSectionProps = VpcCreateTypes['SectionProps']
export type VpcWithSetValueSectionProps = VpcCreateTypes['WithSetValueProps']
