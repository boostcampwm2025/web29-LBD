export interface RouteItem {
  destination: string
  target: string
  isDefault?: boolean
}

export interface Tag {
  key: string
  value: string
}

export interface RouteTableCreateFormData {
  settings: {
    nameTag: string
    vpcId: string
  }
  tags?: Tag[]
}

export interface RouteTableEditFormData {
  selectedRouteTableId: string
  routes: RouteItem[]
  associatedSubnetIds: string[]
}

export type RouteTableSubmitConfig = {
  _type: 'routeTable'

  id?: string
  name?: string

  vpcId?: string

  routes?: RouteItem[]
  subnetIds?: string[]

  tags?: Tag[]
}
