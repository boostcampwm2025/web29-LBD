export const VPC_CREATE_SECTIONS = ['nameTag', 'cidr', 'tenancy'] as const

export type VpcCreateSectionKey = (typeof VPC_CREATE_SECTIONS)[number]

export type VpcCreateConfig = Record<string, any>
