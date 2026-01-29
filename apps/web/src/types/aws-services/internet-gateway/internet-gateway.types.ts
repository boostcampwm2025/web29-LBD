// types/aws-services/internet-gateway.types.ts

// 기존 생성 폼 데이터
export interface InternetGatewayCreateFormData {
  nameTag: string
}

export interface InternetGatewayAttachFormData {
  internetGatewayId: string
  vpcId: string
}

export type InternetGatewaySubmitConfig = {
  _type: 'internetGateway'

  id?: string

  name: string
  vpcName?: string
  vpcId?: string
}
