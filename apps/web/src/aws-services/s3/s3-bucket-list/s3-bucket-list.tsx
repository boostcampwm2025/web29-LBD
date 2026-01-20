'use client'

import {
  BucketTableSection,
  EmptyStateSection,
  FooterInfoSection,
  HeaderSection,
  SearchBarSection,
  SelectionInfoSection,
} from './sections'
import type { Bucket, S3ListWithSetValueSectionProps } from './types'

import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'

interface S3BucketListProps extends S3ListWithSetValueSectionProps {
  onCreateBucket: () => void
  onBucketClick: (bucketName: string) => void
  onRefresh: () => void
}

export default function S3BucketList({
  control,
  config,
  setValue,
  onCreateBucket,
  onBucketClick,
  onRefresh,
}: S3BucketListProps) {
  const buckets = useWatch({ control, name: 'buckets' })
  const searchQuery = useWatch({ control, name: 'searchQuery' })

  const filteredBuckets = useMemo(() => {
    if (!searchQuery) return buckets
    return buckets.filter((bucket: Bucket) =>
      bucket.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [buckets, searchQuery])

  const isEmpty = filteredBuckets.length === 0

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {config.header && (
        <HeaderSection
          control={control}
          config={config}
          onCreateBucket={onCreateBucket}
        />
      )}

      {config.searchBar && (
        <SearchBarSection
          control={control}
          config={config}
          onRefresh={onRefresh}
        />
      )}

      {isEmpty ? (
        <EmptyStateSection onCreateBucket={onCreateBucket} />
      ) : (
        <>
          {config.selectionInfo && (
            <SelectionInfoSection
              control={control}
              config={config}
              setValue={setValue}
            />
          )}

          {config.bucketTable && (
            <BucketTableSection
              control={control}
              config={config}
              setValue={setValue}
              onBucketClick={onBucketClick}
            />
          )}

          {config.footerInfo && (
            <FooterInfoSection control={control} config={config} />
          )}
        </>
      )}
    </div>
  )
}
