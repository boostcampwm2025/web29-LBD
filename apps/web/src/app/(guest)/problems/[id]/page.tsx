import ProblemDetailClient from './problem-detail-client'

import React from 'react'

import { getProblemData } from '@/lib/problem/get-problem-data'

interface ProblemDetailPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    type?: string
  }>
}

export default async function ProblemDetailPage({
  params,
  searchParams,
}: ProblemDetailPageProps) {
  const { id } = await params
  const { type: _type } = await searchParams

  const problemData = await getProblemData(id)

  return (
    <React.Fragment>
      <ProblemDetailClient problemData={problemData} problemId={id} />
    </React.Fragment>
  )
}
