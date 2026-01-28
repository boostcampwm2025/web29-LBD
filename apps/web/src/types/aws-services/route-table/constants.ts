export const ROUTE_TABLE_CREATE_SECTIONS = ['general'] as const
export const ROUTE_TABLE_EDIT_SECTIONS = [
  'routes',
  'subnetAssociations',
] as const

export type RouteTableCreateSectionKey =
  (typeof ROUTE_TABLE_CREATE_SECTIONS)[number]

export type RouteTableCreateConfig = Record<RouteTableCreateSectionKey, boolean>

export type RouteTableEditSectionKey =
  (typeof ROUTE_TABLE_EDIT_SECTIONS)[number]
export type RouteTableEditConfig = Record<RouteTableEditSectionKey, boolean>
