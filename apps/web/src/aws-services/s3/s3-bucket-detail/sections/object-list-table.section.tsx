import type { S3DetailWithSetValueSectionProps, S3Object } from '../types'
import { File, Folder } from 'lucide-react'

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

export const ObjectListTableSection = ({
  control,
  config,
  setValue,
}: S3DetailWithSetValueSectionProps) => {
  const objects = useWatch({ control, name: 'objects' })
  const selectedObjects = useWatch({ control, name: 'selectedObjects' })
  const searchQuery = useWatch({ control, name: 'searchQuery' })

  const filteredObjects = useMemo(() => {
    if (!searchQuery) return objects
    return objects.filter((obj: S3Object) =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [objects, searchQuery])

  if (!config.objectListTable) return null

  const allSelected =
    filteredObjects.length > 0 &&
    filteredObjects.every((obj: S3Object) => selectedObjects.includes(obj.id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setValue(
        'selectedObjects',
        filteredObjects.map((obj: S3Object) => obj.id),
      )
    } else {
      setValue('selectedObjects', [])
    }
  }

  const handleSelectObject = (objectId: string, checked: boolean) => {
    if (checked) {
      setValue('selectedObjects', [...selectedObjects, objectId])
    } else {
      setValue(
        'selectedObjects',
        selectedObjects.filter((id: string) => id !== objectId),
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
            <TableHead>유형</TableHead>
            <TableHead>크기</TableHead>
            <TableHead>마지막 수정 날짜</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredObjects.map((obj: S3Object) => (
            <TableRow key={obj.id}>
              <TableCell>
                <Checkbox
                  checked={selectedObjects.includes(obj.id)}
                  onCheckedChange={(checked) =>
                    handleSelectObject(obj.id, checked === true)
                  }
                  aria-label={`${obj.name} 선택`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {obj.type === 'folder' ? (
                    <>
                      <Folder className="text-primary h-4 w-4" />
                      <button className="text-primary font-medium hover:underline">
                        {obj.name}
                      </button>
                    </>
                  ) : (
                    <>
                      <File className="text-muted-foreground h-4 w-4" />
                      <button className="text-primary font-medium hover:underline">
                        {obj.name}
                      </button>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {obj.type === 'folder' ? '폴더' : '파일'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {obj.size || '-'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {obj.lastModified || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
