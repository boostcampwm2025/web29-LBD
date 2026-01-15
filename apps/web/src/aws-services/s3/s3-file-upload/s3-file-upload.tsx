'use client'

import {
  ActionButtonsSection,
  BreadcrumbSection,
  FileUploadSection,
  HeaderSection,
  PermissionsSection,
  PropertiesSection,
} from './sections'
import type { S3UploadWithSetValueSectionProps } from './types'

interface S3FileUploadProps extends S3UploadWithSetValueSectionProps {
  onPrev: () => void
  onNext: () => void
}

export default function S3FileUpload({
  control,
  config,
  setValue,
  onPrev,
  onNext,
}: S3FileUploadProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {config.breadcrumb && (
        <BreadcrumbSection
          control={control}
          config={config}
          onBucketClick={onPrev}
        />
      )}

      {config.header && <HeaderSection control={control} config={config} />}

      {config.fileUpload && (
        <FileUploadSection
          control={control}
          config={config}
          setValue={setValue}
        />
      )}

      {config.permissions && (
        <PermissionsSection control={control} config={config} />
      )}

      {config.properties && (
        <PropertiesSection control={control} config={config} />
      )}

      {config.actionButtons && (
        <ActionButtonsSection
          control={control}
          config={config}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </div>
  )
}
