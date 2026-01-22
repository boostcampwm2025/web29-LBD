'use client'

import type { FeedbackDetail } from '../components/feedback-detail-card'
import { DiagramPanel, ProblemFormContent } from './components'

import type { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { ProblemFormProvider } from '@/contexts/problem-form-context'
import type { S3BucketFormData } from '@/types/aws-services/s3/bucket-create'
import type { DiagramData } from '@/types/diagram'

interface ProblemDetailClientProps {
  problemData: IServiceMapper[]
  diagramData: DiagramData
  feedbackMessages: FeedbackDetail[]
}

const s3DefaultValues: S3BucketFormData = {
  general: { bucketName: '', region: 'ap-northeast-2' },
  ownership: { aclEnabled: 'disabled' },
  blockPublicAccess: {
    blockAll: true,
    blockPublicAcls: true,
    ignorePublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
  },
  versioning: { enabled: false },
  encryption: { type: 'sse-s3' },
  advancedSettings: { objectLockEnabled: false },
  tags: [],
}

export default function ProblemDetailClient({
  problemData,
  diagramData,
  feedbackMessages,
}: ProblemDetailClientProps) {
  return (
    <ProblemFormProvider defaultValues={s3DefaultValues}>
      <ProblemFormContent problemData={problemData} />
      <DiagramPanel
        diagramData={diagramData}
        feedbackMessages={feedbackMessages}
      />
    </ProblemFormProvider>
  )
}
