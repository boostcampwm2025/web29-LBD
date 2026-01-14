import React from 'react'

import { API_URL } from '@/app/api/api'

interface ProblemDetailPageProps {
  params: {
    id: string
  }
  searchParams: {
    type?: string
  }
}

const getData = async (id: string) => {
  const response = await fetch(`${API_URL}/problems/${id}`)
  return await response.json()
}

export default async function ProblemDetailPage({
  params: { id },
  searchParams: { type },
}: ProblemDetailPageProps) {
  const problemData = await getData(id)

  return <div>page</div>
}
