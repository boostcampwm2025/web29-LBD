export const EC2_INSTANCE_CREATE_SECTIONS = [
  'nameTag',
  'ami',
  'instanceType',
  'keyPair',
  'networkSetting',
  'storage',
  'userData',
] as const

export type EC2InstanceCreateSectionKey =
  (typeof EC2_INSTANCE_CREATE_SECTIONS)[number]

export type EC2InstanceCreateConfig = Record<
  EC2InstanceCreateSectionKey,
  boolean
>
