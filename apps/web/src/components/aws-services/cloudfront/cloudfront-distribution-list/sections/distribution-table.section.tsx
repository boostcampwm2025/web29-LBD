import { CheckCircle2, Clock, Globe, XCircle } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Distribution } from '@/types/aws-services/cloudfront/distribution-list'

interface DistributionTableSectionProps {
  distributions: Distribution[]
  selectedDistributions: Set<string>
  onSelectAll: (checked: boolean) => void
  onSelectDistribution: (distId: string, checked: boolean) => void
  onDistributionClick: (distId: string) => void
}

export function DistributionTableSection({
  distributions,
  selectedDistributions,
  onSelectAll,
  onSelectDistribution,
  onDistributionClick,
}: DistributionTableSectionProps) {
  const allSelected =
    distributions.length > 0 &&
    distributions.every((dist) => selectedDistributions.has(dist.id))

  const getStateIcon = (state: Distribution['state']) => {
    switch (state) {
      case 'Deployed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'Deploying':
      case 'In Progress':
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getStateColor = (state: Distribution['state']) => {
    switch (state) {
      case 'Deployed':
        return 'text-green-600'
      case 'Deploying':
      case 'In Progress':
        return 'text-orange-600'
      default:
        return 'text-muted-foreground'
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
                onCheckedChange={onSelectAll}
                aria-label="모두 선택"
              />
            </TableHead>
            <TableHead>배포 ID</TableHead>
            <TableHead>도메인 이름</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>State</TableHead>
            <TableHead>마지막 수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {distributions.map((dist) => (
            <TableRow key={dist.id}>
              <TableCell>
                <Checkbox
                  checked={selectedDistributions.has(dist.id)}
                  onCheckedChange={(checked) =>
                    onSelectDistribution(dist.id, checked === true)
                  }
                  aria-label={`${dist.id} 선택`}
                />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <button
                    className="text-primary font-medium hover:underline"
                    onClick={() => onDistributionClick(dist.id)}
                  >
                    {dist.id}
                  </button>
                  {dist.name && (
                    <p className="text-muted-foreground text-xs">{dist.name}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Globe className="text-muted-foreground h-4 w-4" />
                  <span className="font-mono text-sm">{dist.domainName}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate text-sm">
                {dist.origin}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {dist.status === 'Enabled' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">활성화</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        비활성화
                      </span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStateIcon(dist.state)}
                  <span className={`text-sm ${getStateColor(dist.state)}`}>
                    {dist.state}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {dist.lastModified}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
