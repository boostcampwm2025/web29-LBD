'use client'

import {
  BreadcrumbSection,
  EmptyStateSection,
  FooterInfoSection,
  HeaderSection,
  ObjectListTableSection,
  SearchBarSection,
  SelectionInfoSection,
} from './sections'
import type { S3DetailWithSetValueSectionProps, S3Object } from './types'

import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'

interface S3BucketDetailProps extends S3DetailWithSetValueSectionProps {
  onUpload: () => void
}

export default function S3BucketDetail({
  control,
  config,
  setValue,
  onUpload,
}: S3BucketDetailProps) {
  const objects = useWatch({ control, name: 'objects' })
  const searchQuery = useWatch({ control, name: 'searchQuery' })

  const filteredObjects = useMemo(() => {
    if (!searchQuery) return objects
    return objects.filter((obj: S3Object) =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [objects, searchQuery])

  const isEmpty = filteredObjects.length === 0

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {config.breadcrumb && (
        <BreadcrumbSection control={control} config={config} />
      )}

      {config.header && (
        <HeaderSection control={control} config={config} onUpload={onUpload} />
      )}

      {config.searchBar && (
        <SearchBarSection control={control} config={config} />
      )}

      {isEmpty ? (
        <EmptyStateSection onUpload={onUpload} />
      ) : (
        <>
          {config.selectionInfo && (
            <SelectionInfoSection
              control={control}
              config={config}
              setValue={setValue}
            />
          )}

          {config.objectListTable && (
            <ObjectListTableSection
              control={control}
              config={config}
              setValue={setValue}
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
