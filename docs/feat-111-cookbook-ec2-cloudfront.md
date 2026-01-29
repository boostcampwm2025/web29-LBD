# feat/#111-cookbook-ec2-cloudfront 브랜치 작업 정리

## 🎯 주요 변경 목표

**CloudFront-EC2 직접 연결 쿡북 문제를 위한 기반 기능 구현** - Security Group UI/검증 및 EC2 User Data 기능 추가

### 구현 범위

```
1. Security Group 생성 기능
   - 타입 정의 및 폼 UI 컴포넌트
   - 다이어그램 노드 지원 (빨간 테두리 그룹)
   - unit 문제 seed 데이터

2. EC2 User Data 기능
   - UI 섹션 컴포넌트 (Textarea)
   - 검증 로직 (키워드 포함 검사)
   - nginx 설정 unit 문제

3. 다이어그램 리팩토링
   - NODE_TYPE_CONFIG 기반 설정 중앙화
```

---

## 🆕 추가된 파일

### Security Group 컴포넌트 (8개 파일, +600 lines)

```
apps/web/src/components/aws-services/ec2/ec2-security-group/    🆕 신규
├── index.ts
├── ec2-security-group.tsx                    # 메인 폼 컴포넌트
└── sections/
    ├── index.ts
    ├── basic-info.section.tsx                # 기본 정보 (이름, VPC)
    ├── inbound-rules.section.tsx             # 인바운드 규칙
    └── outbound-rules.section.tsx            # 아웃바운드 규칙
```

### Security Group 타입 정의 (4개 파일, +111 lines)

```
apps/web/src/types/aws-services/ec2/security-group/    🆕 신규
├── index.ts
├── constants.ts                              # 섹션 상수
├── sg-config.types.ts                        # Config 타입
└── sg-form-data.types.ts                     # 폼 데이터 타입

apps/web/src/types/aws-services/ec2/
└── sg-submit-config.types.ts                 # Submit Config 타입
```

### EC2 User Data 섹션 (1개 파일)

```
apps/web/src/components/aws-services/ec2/ec2-instance-create/sections/
└── user-data.section.tsx                     🆕 신규
```

### 기타

```
apps/web/src/components/ui/textarea.tsx       🆕 Textarea UI 컴포넌트
apps/web/src/lib/buildInitialNodes.ts         🆕 초기 노드 빌드 함수
```

---

## 📁 변경된 파일 구조

```
apps/web/src/
├── components/
│   ├── ui/
│   │   └── textarea.tsx                      # 🆕 Radix Textarea
│   │
│   ├── diagram/
│   │   ├── aws-icons.ts                      # ✏️ securityGroup 아이콘 추가
│   │   └── nodes/aws-group-node.tsx          # ✏️ borderColor/bgColor 지원
│   │
│   └── aws-services/
│       ├── registry/registry.ts              # ✏️ SecurityGroup 등록
│       │
│       └── ec2/
│           ├── ec2-security-group/           # 🆕 Security Group 컴포넌트
│           └── ec2-instance-create/
│               ├── ec2-instance-create.tsx   # ✏️ UserData 섹션 추가
│               └── sections/
│                   ├── index.ts              # ✏️ UserData export
│                   └── user-data.section.tsx # 🆕 User Data 섹션
│
├── constants/aws-services/ec2/
│   └── ec2-tooltips.constants.ts             # ✏️ userData 툴팁 추가
│
├── contexts/
│   └── problem-form-context.tsx              # ✏️ buildInitialNodes 분리
│
├── hooks/diagram/
│   ├── index.ts                              # ✏️ NODE_TYPE_CONFIG export
│   ├── types.ts                              # ✏️ NodeTypeConfig 추가
│   └── useDiagramLogic.ts                    # ✏️ getNodeConfig() 사용
│
├── lib/
│   └── buildInitialNodes.ts                  # 🆕 초기 노드 빌드 함수
│
└── types/
    ├── submitConfig.types.ts                 # ✏️ SecurityGroups 타입 추가
    └── aws-services/ec2/
        ├── ec2-submit-config.types.ts        # ✏️ userData 필드 추가
        ├── sg-submit-config.types.ts         # 🆕 SG Submit Config
        ├── security-group/                   # 🆕 SG 타입 디렉토리
        └── instance-create/
            ├── constants.ts                  # ✏️ 'userData' 섹션 추가
            └── ec2-form-data.types.ts        # ✏️ userData 필드 추가
```

### Backend 변경

```
apps/server/src/
├── problems/
│   ├── types/
│   │   ├── service-config-type.enum.ts       # ✏️ EC2Config.userData 추가
│   │   ├── requirements-types.ts             # ✏️ requireUserData 옵션 추가
│   │   └── unit-problem-feedback-types.ts    # ✏️ USER_DATA 피드백 코드
│   │
│   └── validation/handlers/
│       └── unit-service-specific-validation/
│           └── unit-ec2-scenario.handler.ts  # ✏️ User Data 검증 로직
│
└── seeds/
    └── problems.seed.ts                      # ✏️ SG, User Data 문제 추가
```

---

## 🏗️ 변경된 아키텍처

### 다이어그램 노드 설정 - NODE_TYPE_CONFIG 패턴

```typescript
// 변경 전: 조건문 기반
const isGroupType = payload._type === 'vpc' || payload._type === 'subnet' || ...
const isSecurityGroup = payload._type === 'securityGroup' || ...
const width = payload._type === 'vpc' ? 400 : payload._type === 'subnet' ? 300 : 80

// 변경 후: 설정 객체 기반
const NODE_TYPE_CONFIG: Record<string, NodeTypeConfig> = {
  vpc: { nodeType: 'awsGroup', width: 400, height: 300 },
  subnet: { nodeType: 'awsGroup', width: 300, height: 200 },
  securityGroup: { nodeType: 'awsGroup', width: 300, height: 200, borderColor: 'red', bgColor: 'red' },
}

const nodeConfig = getNodeConfig(payload._type)
```

### EC2 User Data 검증 - 키워드 포함 검사

```typescript
// requirements-types.ts
interface Ec2Requirements {
  ec2?: {
    [ec2Name: string]: {
      requireUserData?: boolean;
      userDataMustContain?: string[];  // 🆕 키워드 배열
    };
  };
}

// 검증 로직
if (req.userDataMustContain?.length) {
  for (const keyword of req.userDataMustContain) {
    if (!script.includes(keyword)) {
      feedbacks.push({ code: 'EC2_USER_DATA_INCOMPLETE', ... })
    }
  }
}
```

---

## 📊 Security Group 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      EC2SecurityGroupCreate                              │
│                                                                          │
│   FormData: { basicInfo, inboundRules[], outboundRules[] }              │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ onSubmit
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SGSubmitConfig                                      │
│                                                                          │
│   { _type: 'securityGroups', name, vpcId, ipPermissions[] }             │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ handleAddItem('securityGroups', data)
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DiagramPanel                                        │
│                                                                          │
│   awsGroup 노드 생성 (borderColor: 'red', bgColor: 'red')               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 추가된 타입

### GlobalSubmitConfig 확장

```typescript
// types/submitConfig.types.ts
export interface GlobalSubmitConfig {
  s3?: ServiceConfigItem<S3SubmitConfig>[]
  cloudFront?: ServiceConfigItem<CloudFrontSubmitConfig>[]
  ec2?: ServiceConfigItem<EC2SubmitConfig>[]
  securityGroups?: ServiceConfigItem<SGSubmitConfig>[]  // 🆕
}

export type ServiceType = 's3' | 'cloudFront' | 'ec2' | 'securityGroups'
```

### Security Group Submit Config

```typescript
// types/aws-services/ec2/sg-submit-config.types.ts
export type SGSubmitConfig = {
  _type: 'securityGroups'
  id: string
  name: string
  vpcId: string
  vpcName: string
  ipPermissions: SGRule[]
}

export type SGRule = {
  ipProtocol: string
  fromPort: string
  toPort: string
  cidrIp: string
  isInbound: boolean
}
```

### EC2 User Data

```typescript
// EC2InstanceFormData
userData?: {
  script: string
}

// EC2SubmitConfig
userData?: string
```

---

## 📝 커밋 히스토리

| 커밋 | 설명 | 변경 |
|------|------|------|
| `75ba10a` | fix: buildInitialNodes 누락 파일 복구 | 초기 노드 빌드 함수 |
| `e2c097f` | feat: Textarea UI 컴포넌트 추가 | Radix 기반 Textarea |
| `907fe05` | feat: Security Group 타입 정의 추가 | 4개 타입 파일 |
| `840730f` | feat: Security Group UI 컴포넌트 구현 | 폼 + 섹션 컴포넌트 |
| `ff4f563` | feat: Security Group 다이어그램 노드 지원 | 빨간 테두리 그룹 노드 |
| `80f91cb` | feat: Security Group unit 문제 seed 데이터 추가 | HTTP 포트 열기 문제 |
| `bb0b4b5` | refactor: 다이어그램 노드 설정을 NODE_TYPE_CONFIG 기반으로 리팩토링 | 조건문 제거 |
| `e9cd108` | feat: EC2 User Data UI 섹션 추가 | Textarea 기반 섹션 |
| `f9e0666` | feat: EC2 User Data 검증 로직 추가 | 키워드 포함 검사 |
| `511943d` | feat: EC2 User Data nginx 설정 unit 문제 추가 | nginx 설치 문제 |
| `818fdb4` | fix: securityGroups 중복 엔트리 제거 | 미사용 복수형 제거 |

---

## ✅ 핵심 변경사항 요약

| 항목 | 내용 |
|------|------|
| Security Group | 타입, UI 컴포넌트, 다이어그램 노드, unit 문제 |
| EC2 User Data | UI 섹션, 검증 로직, nginx 설치 unit 문제 |
| 다이어그램 | NODE_TYPE_CONFIG 기반 설정 중앙화 |
| 코드량 | **32개 파일, +1009 / -47 lines** |

---

## 🔍 검증 방법

```bash
# 빌드 확인
pnpm --filter web build
pnpm --filter server build

# 린트 확인
pnpm --filter web lint
pnpm --filter server lint

# 기능 테스트
# 1. /problems/[id] 페이지에서 Security Group 생성 폼 확인
# 2. 다이어그램에 빨간 테두리 Security Group 노드 생성 확인
# 3. EC2 인스턴스 생성 폼에서 User Data 섹션 확인
# 4. User Data 문제 제출 시 키워드 검증 동작 확인
```

---

## 🎯 관련 Unit 문제

| 문제 | 설명 | 검증 |
|------|------|------|
| EC2 보안 그룹 HTTP 포트 열기 | 보안 그룹에 80포트 인바운드 규칙 추가 | requireOpenPorts: [80] |
| EC2 User Data로 nginx 웹서버 설정 | User Data로 nginx 자동 설치 | userDataMustContain: ['nginx', 'yum install', 'systemctl start'] |
