export const AMI_OPTIONS = [
  {
    value: 'amazon-linux',
    label: 'Amazon Linux',
    description: 'AWS에 최적화된 Linux 배포판',
    icon: '/icons/aws/ami/aws-linux.svg',
  },
  {
    value: 'ubuntu',
    label: 'Ubuntu',
    description: '가장 인기 있는 Linux 배포판',
    icon: '/icons/aws/ami/ubuntu.svg',
  },
  {
    value: 'windows',
    label: 'Windows',
    description: 'Microsoft Windows Server',
    icon: '/icons/aws/ami/windows.svg',
  },
  {
    value: 'mac-os',
    label: 'macOS',
    description: 'Apple macOS',
    icon: '/icons/aws/ami/mac-os.svg',
  },
  {
    value: 'red-hat',
    label: 'Red Hat',
    description: 'Red Hat Enterprise Linux',
    icon: '/icons/aws/ami/red-hat.svg',
  },
  {
    value: 'suse-linux',
    label: 'SUSE Linux',
    description: 'SUSE Linux Enterprise',
    icon: '/icons/aws/ami/suse-linux.svg',
  },
  {
    value: 'debian',
    label: 'Debian',
    description: 'Debian GNU/Linux',
    icon: '/icons/aws/ami/debian.svg',
  },
] as const

export const INSTANCE_TYPE_OPTIONS = [
  {
    value: 't2.micro',
    label: 't2.micro',
    vcpu: '1 vCPU',
    memory: '1 GiB',
  },
  {
    value: 't2.small',
    label: 't2.small',
    vcpu: '1 vCPU',
    memory: '2 GiB',
  },
  {
    value: 't2.medium',
    label: 't2.medium',
    vcpu: '2 vCPU',
    memory: '4 GiB',
  },
  {
    value: 't3.micro',
    label: 't3.micro',
    vcpu: '2 vCPU',
    memory: '1 GiB',
  },
  {
    value: 't3.small',
    label: 't3.small',
    vcpu: '2 vCPU',
    memory: '2 GiB',
  },
  {
    value: 't3.medium',
    label: 't3.medium',
    vcpu: '2 vCPU',
    memory: '4 GiB',
  },
] as const

export const KEY_PAIR_OPTIONS = [
  { value: 'my-key-pair', label: 'my-key-pair' },
  { value: 'dev-key-pair', label: 'dev-key-pair' },
  { value: 'prod-key-pair', label: 'prod-key-pair' },
] as const

export const FIREWALL_OPTIONS = [
  {
    name: 'networkSetting.allowSSH',
    id: 'allow-ssh',
    label: '인터넷에서 SSH 트래픽 허용',
    description: '포트 22 • 원격으로 인스턴스에 접속할 수 있습니다',
  },
  {
    name: 'networkSetting.allowHTTPS',
    id: 'allow-https',
    label: '인터넷에서 HTTPS 트래픽 허용',
    description: '포트 443 • 보안 웹 서버를 운영할 수 있습니다',
  },
  {
    name: 'networkSetting.allowHTTP',
    id: 'allow-http',
    label: '인터넷에서 HTTP 트래픽 허용',
    description: '포트 80 • 웹 서버를 운영할 수 있습니다',
  },
] as const

export const VOLUME_TYPE_OPTIONS = [
  {
    value: 'gp3',
    label: '범용 SSD (gp3)',
    iops: '3000 IOPS',
  },
  {
    value: 'gp2',
    label: '범용 SSD (gp2)',
    iops: '',
  },
  {
    value: 'io1',
    label: '프로비저닝된 IOPS SSD (io1)',
    iops: '400 IOPS',
  },
  {
    value: 'io2',
    label: '프로비저닝된 IOPS SSD (io2)',
    iops: '8000 IOPS',
  },
  {
    value: 'standard',
    label: '마그네틱(표준)',
    iops: '',
  },
] as const
