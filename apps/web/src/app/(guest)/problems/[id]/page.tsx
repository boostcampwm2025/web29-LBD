import React from 'react'

// import { API_URL } from '@/app/api/api'
import {
  IServiceMapper,
  serviceMapper,
} from '@/aws-services/utils/serviceMapper'

interface ProblemDetailPageProps {
  params: {
    id: string
  }
  searchParams: {
    type?: string
  }
}

const getData = (_id: string) => {
  // const response = await fetch(`${API_URL}/problems/${id}`)
  // return await response.json()

  const result: IServiceMapper = {
    serviceName: 'S3',
    serviceTask: 'bucket-create',
    inputSections: ['general', 'ownership', 'public'],
  }
  return result
}

export default async function ProblemDetailPage({
  params: { id },
  searchParams: { type: _type },
}: ProblemDetailPageProps) {
  const problemData = getData(id)
  const { Component, config } = serviceMapper(problemData)
  return <Component {...config} />
}
