import { Lock, LockOpen } from 'lucide-react'

import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {
  Bucket,
  S3ListWithSetValueSectionProps,
} from '@/types/aws-services/s3/bucket-list'

interface BucketTableSectionProps extends S3ListWithSetValueSectionProps {
  onBucketClick: (bucketName: string) => void
}

export const BucketTableSection = ({
  control,
  config,
  setValue,
  onBucketClick,
}: BucketTableSectionProps) => {
  const buckets = useWatch({ control, name: 'buckets' })
  const selectedBuckets = useWatch({ control, name: 'selectedBuckets' })
  const searchQuery = useWatch({ control, name: 'searchQuery' })

  const filteredBuckets = useMemo(() => {
    if (!searchQuery) return buckets
    return buckets.filter((bucket: Bucket) =>
      bucket.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [buckets, searchQuery])

  if (!config.bucketTable) return null

  const allSelected =
    filteredBuckets.length > 0 &&
    filteredBuckets.every((bucket: Bucket) =>
      selectedBuckets.includes(bucket.id),
    )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setValue(
        'selectedBuckets',
        filteredBuckets.map((bucket: Bucket) => bucket.id),
      )
    } else {
      setValue('selectedBuckets', [])
    }
  }

  const handleSelectBucket = (bucketId: string, checked: boolean) => {
    if (checked) {
      setValue('selectedBuckets', [...selectedBuckets, bucketId])
    } else {
      setValue(
        'selectedBuckets',
        selectedBuckets.filter((id: string) => id !== bucketId),
      )
    }
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="모두 선택"
              />
            </TableHead>
            <TableHead>이름</TableHead>
            <TableHead>AWS 리전</TableHead>
            <TableHead>액세스</TableHead>
            <TableHead>생성 날짜</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBuckets.map((bucket: Bucket) => (
            <TableRow key={bucket.id}>
              <TableCell>
                <Checkbox
                  checked={selectedBuckets.includes(bucket.id)}
                  onCheckedChange={(checked) =>
                    handleSelectBucket(bucket.id, checked === true)
                  }
                  aria-label={`${bucket.name} 선택`}
                />
              </TableCell>
              <TableCell>
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => onBucketClick(bucket.name)}
                >
                  {bucket.name}
                </button>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {bucket.region}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {bucket.access === 'public' ? (
                    <>
                      <LockOpen className="text-destructive h-4 w-4" />
                      <span className="text-destructive text-sm">퍼블릭</span>
                    </>
                  ) : (
                    <>
                      <Lock className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        비공개
                      </span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {bucket.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
