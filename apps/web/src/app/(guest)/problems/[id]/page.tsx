import React from 'react'

// import { API_URL } from '@/app/api/api'
import {
  IServiceMapper,
  serviceMapper,
} from '@/components/aws-services/utils/serviceMapper'

interface ProblemDetailPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    type?: string
  }>
}

const getData = (_id: string) => {
  // const response = await fetch(`${API_URL}/problems/${id}`)
  // return await response.json()

  const result: IServiceMapper = {
    serviceName: 'S3',
    serviceTask: 'bucket-create',
    inputSections: ['general', 'ownership', 'blockPublicAccess'],
  }
  return result
}

export default async function ProblemDetailPage({
  params,
  searchParams,
}: ProblemDetailPageProps) {
  const { id } = await params
  const { type: _type } = await searchParams
  const problemData = getData(id)
  const { Component, config } = serviceMapper(problemData)
  return <Component config={config} />
}
