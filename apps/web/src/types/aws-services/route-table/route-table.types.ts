export interface RouteItem {
  destinationCidr: string
  targetGatewayId: string
}

export interface RouteTableCreateFormData {
  settings: {
    nameTag: string
    vpcId: string
  }
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
  vpcName?: string

  routes?: RouteItem[]
  associations?: { subnetId: string }[]
}
