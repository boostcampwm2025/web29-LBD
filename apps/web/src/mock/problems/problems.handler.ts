import { HttpResponse, http } from 'msw'

export const problemsHandlers = [
  http.get(`/api/problems`, ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')

    if (type === 'unit') {
      return HttpResponse.json([
        {
          id: 1,
          title: 'VPC 서브넷 구성',
          description: 'Public 서브넷에 EC2 인스턴스를 배치하세요',
          tags: ['VPC', 'EC2', 'Subnet', 'Networking'],
        },
        {
          id: 2,
          title: 'S3 버킷 생성',
          description: '버전 관리가 활성화된 S3 버킷을 생성하세요',
          tags: ['S3', 'Storage', 'Versioning'],
        },
        {
          id: 3,
          title: '보안 그룹 설정',
          description: 'EC2 인스턴스에 대한 보안 그룹을 설정하세요',
          tags: ['EC2', 'Security', 'Networking'],
        },
        {
          id: 4,
          title: 'RDS 인스턴스 배포',
          description: 'MySQL RDS 인스턴스를 배포하세요',
          tags: ['RDS', 'Database', 'MySQL'],
        },
      ])
    }

    if (type === 'cookbook') {
      return HttpResponse.json([
        {
          id: 5,
          title: 'VPC 서브넷 구성',
          description: 'Public 서브넷에 EC2 인스턴스를 배치하세요',
          tags: ['VPC', 'EC2', 'Subnet', 'Networking'],
          problems: [
            {
              id: 1,
              title: 'VPC 서브넷 구성',
              description: 'Public 서브넷에 EC2 인스턴스를 배치하세요',
            },
            {
              id: 3,
              title: '보안 그룹 설정',
              description: 'EC2 인스턴스에 대한 보안 그룹을 설정하세요',
            },
          ],
        },
        {
          id: 6,
          title: '웹 애플리케이션 호스팅',
          description: 'EC2와 RDS를 사용하여 웹 애플리케이션을 호스팅하세요',
          tags: ['EC2', 'RDS', 'Web', 'Hosting'],
          problems: [
            {
              id: 2,
              title: 'S3 버킷 생성',
              description: '버전 관리가 활성화된 S3 버킷을 생성하세요',
            },
            {
              id: 4,
              title: 'RDS 인스턴스 배포',
              description: 'MySQL RDS 인스턴스를 배포하세요',
            },
          ],
        },
      ])
    }

    return HttpResponse.json([])
  }),
]
