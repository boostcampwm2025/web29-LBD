export interface Distribution {
  id: string
  name: string
  domainName: string
  status: 'Enabled' | 'Disabled'
  state: 'Deployed' | 'Deploying' | 'In Progress'
  lastModified: string
  origin: string
}

export interface CloudFrontListFormData {
  searchQuery: string
  selectedDistributions: string[]
}
