export const SUBNET_CREATE_SECTIONS = ['general'] as const

export type SubnetCreateSectionKey = (typeof SUBNET_CREATE_SECTIONS)[number]

export type SubnetCreateConfig = Record<SubnetCreateSectionKey, boolean>
