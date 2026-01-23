'use client'

import {
  DistributionTableSection,
  EmptyStateSection,
  FooterInfoSection,
  HeaderSection,
  SearchBarSection,
  SelectionInfoSection,
} from './sections'

import React, { useState } from 'react'
import { useWatch } from 'react-hook-form'

import type {
  CloudFrontListWithSetValueSectionProps,
  Distribution,
} from '@/types/aws-services/cloudfront/distribution-list'

// 샘플 배포 데이터
const SAMPLE_DISTRIBUTIONS: Distribution[] = [
  {
    id: 'E1ABCDEFGH123',
    name: 'my-static-website',
    domainName: 'd111111abcdef8.cloudfront.net',
    status: 'Enabled',
    state: 'Deployed',
    lastModified: '2024년 1월 15일 14:32',
    origin: 'my-application-assets.s3.ap-northeast-2.amazonaws.com',
  },
  {
    id: 'E2BCDEFGHI234',
    name: 'api-distribution',
    domainName: 'd222222abcdef8.cloudfront.net',
    status: 'Enabled',
    state: 'Deployed',
    lastModified: '2024년 2월 20일 10:15',
    origin: 'api.example.com',
  },
  {
    id: 'E3CDEFGHIJ345',
    name: '',
    domainName: 'd333333abcdef8.cloudfront.net',
    status: 'Disabled',
    state: 'Deployed',
    lastModified: '2024년 3월 5일 16:48',
    origin: 'static-website-bucket.s3.us-east-1.amazonaws.com',
  },
  {
    id: 'E4DEFGHIJK456',
    name: 'cdn-assets',
    domainName: 'd444444abcdef8.cloudfront.net',
    status: 'Enabled',
    state: 'In Progress',
    lastModified: '2024년 3월 12일 09:22',
    origin: 'cdn-static-assets.s3.us-west-2.amazonaws.com',
  },
]

interface CloudFrontDistributionListProps extends CloudFrontListWithSetValueSectionProps {
  onNext?: () => void
}

export default function CloudFrontDistributionList({
  control,
  config,
  setValue: _setValue,
  onNext,
}: CloudFrontDistributionListProps) {
  const [selectedDistributions, setSelectedDistributions] = useState<
    Set<string>
  >(new Set())
  const [distributions] = useState<Distribution[]>(SAMPLE_DISTRIBUTIONS)

  const searchQuery = useWatch({ control, name: 'searchQuery' }) || ''

  // 검색 필터링
  const filteredDistributions = React.useMemo(() => {
    if (!searchQuery) return distributions
    return distributions.filter(
      (dist) =>
        dist.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dist.domainName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [distributions, searchQuery])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDistributions(new Set(filteredDistributions.map((d) => d.id)))
    } else {
      setSelectedDistributions(new Set())
    }
  }

  const handleSelectDistribution = (distId: string, checked: boolean) => {
    const newSelected = new Set(selectedDistributions)
    if (checked) {
      newSelected.add(distId)
    } else {
      newSelected.delete(distId)
    }
    setSelectedDistributions(newSelected)
  }

  const handleDistributionClick = (distId: string) => {
    console.log('배포 선택:', distId)
    onNext?.()
  }

  const handleRefresh = () => {
    console.log('배포 목록 새로고침')
  }

  const handleCreateDistribution = () => {
    console.log('배포 생성 페이지로 이동')
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {config.header && <HeaderSection />}

      {config.searchBar && (
        <SearchBarSection
          control={control}
          config={config}
          onRefresh={handleRefresh}
        />
      )}

      {filteredDistributions.length === 0 && !searchQuery ? (
        <EmptyStateSection onCreateDistribution={handleCreateDistribution} />
      ) : (
        <>
          {config.selectionInfo && (
            <SelectionInfoSection
              selectedCount={selectedDistributions.size}
              onClearSelection={() => setSelectedDistributions(new Set())}
            />
          )}

          {filteredDistributions.length === 0 ? (
            <EmptyStateSection isSearchResult />
          ) : (
            <>
              {config.distributionTable && (
                <DistributionTableSection
                  distributions={filteredDistributions}
                  selectedDistributions={selectedDistributions}
                  onSelectAll={handleSelectAll}
                  onSelectDistribution={handleSelectDistribution}
                  onDistributionClick={handleDistributionClick}
                />
              )}

              {config.footerInfo && (
                <FooterInfoSection
                  totalCount={filteredDistributions.length}
                  searchQuery={searchQuery}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
