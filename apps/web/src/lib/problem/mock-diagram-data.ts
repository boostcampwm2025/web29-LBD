import type { DiagramData } from '@/types/diagram'

// Backend API가 diagram_template을 반환하기 전까지 사용할 mock 데이터
export const mockDiagramData: DiagramData = {
  nodes: [
    {
      id: 'aws-cloud',
      type: 'awsGroup',
      position: { x: 0, y: 0 },
      data: {
        label: 'AWS Cloud',
        icon: 'awsCloud',
        borderColor: 'gray',
        bgColor: 'gray',
        width: 400,
        height: 250,
      },
    },
    {
      id: 's3',
      type: 'awsService',
      position: { x: 150, y: 100 },
      data: { label: 'S3', icon: 's3', description: 'Storage' },
      parentId: 'aws-cloud',
      extent: 'parent',
    },
  ],
  edges: [],
}
