# refactor/#85-provider-diagram 브랜치 작업 정리

## 🎯 주요 변경 목표

**Registry/Mapper 아키텍처 통합** - 중복된 Renderer 레이어를 제거하고, Layout 레벨에서 다이어그램을 합성하는 방식으로 단순화

### 변경 전 (Before)
```
problemData → serviceMapper → AWS_SERVICE_REGISTRY → Component
                    ↓
            RENDERER_REGISTRY → Renderer (폼 + 다이어그램 중복)
```

### 변경 후 (After)
```
problemData → serviceMapper → AWS_SERVICE_REGISTRY → Component
                                                          ↓
                                              ProblemFormContent에서 렌더링
                                                          ↓
                                              DiagramPanel (Layout 레벨)
```

---

## 🗑️ 삭제된 파일

### service-renderer 디렉토리 전체 삭제 (15개 파일, -844 lines)

```
apps/web/src/components/service-renderer/    ❌ 삭제
├── index.ts
├── types.ts
├── registry.ts                              # RENDERER_REGISTRY
├── renderer-mapper.ts
├── s3/
│   ├── index.ts
│   ├── s3-bucket-create-renderer.tsx
│   ├── s3-bucket-detail-renderer.tsx
│   ├── s3-bucket-list-renderer.tsx
│   └── s3-file-upload-renderer.tsx
└── cloudfront/
    ├── index.ts
    ├── cloudfront-cache-behavior-renderer.tsx
    ├── cloudfront-distribution-list-renderer.tsx
    ├── cloudfront-distribution-settings-renderer.tsx
    ├── cloudfront-origin-settings-renderer.tsx
    └── cloudfront-website-settings-renderer.tsx
```

**삭제 이유:**
- `problem-form-content.tsx`가 이미 폼 렌더링 및 생성된 리소스 목록 표시 담당
- `DiagramPanel`이 Layout 레벨에서 다이어그램 렌더링 담당
- Renderer가 두 기능을 중복 구현하고 있었음

### adapters 디렉토리 삭제 (2개 파일, -130 lines)

```
apps/web/src/components/aws-services/adapters/    ❌ 삭제
├── index.ts
└── s3-bucket-create-adapter.tsx
```

**삭제 이유:**
- 컴포넌트가 직접 `onSubmit` props를 받도록 변경하여 어댑터 레이어 불필요

---

## 📁 변경된 파일 구조

```
apps/web/src/
├── components/
│   ├── aws-diagram.tsx                    # ✏️ props optional로 변경
│   │
│   └── aws-services/
│       ├── registry/
│       │   └── registry.ts                # ✏️ versioning.enabled 수정
│       │
│       ├── s3/
│       │   ├── s3-bucket-create/
│       │   │   └── s3-bucket-create.tsx   # ✏️ versioning.enabled + onSubmit
│       │   └── s3-bucket-list/
│       │       └── s3-bucket-list.tsx     # ✏️ onSubmit props 추가
│       │
│       ├── cloudfront/
│       │   ├── cloudfront-cache-behavior/      # ✏️ onSubmit props 추가
│       │   ├── cloudfront-distribution-settings/
│       │   ├── cloudfront-origin-settings/
│       │   └── cloudfront-website-settings/
│       │
│       ├── ec2/
│       │   └── ec2-instance-create/       # ✏️ onSubmit props 추가
│       │
│       └── utils/
│           └── flattenObject.ts           # ✏️ 타입 개선
│
├── contexts/
│   └── problem-form-context.tsx           # ✏️ 다이어그램 연동 개선
│
├── app/(guest)/problems/[id]/
│   ├── problem-detail-client.tsx          # ✏️ 레이아웃 정리
│   ├── layout.tsx                         # ❌ 삭제
│   └── components/left-section/
│       └── problem-form-content.tsx       # ✏️ serviceMapper 통합
│
└── types/
    ├── submitConfig.types.ts              # ✏️ CloudFront, EC2 타입 추가
    └── aws-services/
        ├── s3/bucket-create/
        │   ├── s3-form-data.types.ts      # ✏️ versioning.enabled
        │   └── s3-submit-config.type.ts   # ✏️ _type 필드 추가
        ├── cloudfront/
        │   └── cloudfront-submit-config.types.ts   # 🆕 신규
        └── ec2/
            ├── ec2-submit-config.types.ts          # 🆕 신규
            └── instance-create/ec2-config.types.ts # ✏️ 수정
```

---

## 🏗️ 변경된 아키텍처

### AWS 서비스 컴포넌트 - onSubmit Props 패턴

```tsx
// 변경 전: 어댑터를 통한 간접 호출
<S3BucketCreateAdapter />  // 내부에서 context 직접 접근

// 변경 후: props를 통한 명시적 의존성 주입
<S3BucketCreate
  config={config}
  onSubmit={(data) => handleAddItem('s3', data)}
/>
```

### ProblemFormContent - 통합된 렌더링

```tsx
// components/left-section/problem-form-content.tsx
export function ProblemFormContent({ problemData }: ProblemFormContentProps) {
  const { handleAddItem, submitConfig, handleRemoveItem } = useProblemForm()

  return (
    <>
      {problemData.map((mapper, index) => {
        const { Component, config } = serviceMapper(mapper)
        const serviceType = getServiceType(mapper.serviceName)
        const createdItems = submitConfig[serviceType] || []

        return (
          <div key={...}>
            {/* 1. 서비스 폼 */}
            <Component
              config={config}
              onSubmit={(data) => handleAddItem(serviceType, data)}
            />

            {/* 2. 생성된 리소스 목록 */}
            {createdItems.length > 0 && (
              <CreatedResourcesList
                items={createdItems}
                onRemove={(id) => handleRemoveItem(serviceType, id)}
              />
            )}
          </div>
        )
      })}
    </>
  )
}
```

---

## 📊 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ProblemFormProvider                              │
│                                                                          │
│   submitConfig: { s3: [...], cloudFront: [...], ec2: [...] }            │
│   nodes/edges: 다이어그램 상태                                            │
│   handleAddItem / handleRemoveItem                                       │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ ProblemFormContent │  │  DiagramPanel   │  │  FeedbackPanel  │
│                 │  │                 │  │                 │
│  serviceMapper  │  │  nodes/edges    │  │    feedback     │
│       ↓         │  │       ↓         │  │       ↓         │
│   Component     │  │   ReactFlow     │  │  FeedbackCard   │
│       ↓         │  └─────────────────┘  └─────────────────┘
│   onSubmit()    │
│       ↓         │
│  handleAddItem  │──▶ submitConfig 업데이트 + 다이어그램 노드 추가
└─────────────────┘
```

---

## 🆕 추가된 타입

### GlobalSubmitConfig 확장

```tsx
// types/submitConfig.types.ts
export interface GlobalSubmitConfig {
  s3?: ServiceConfigItem<S3SubmitConfig>[]
  cloudFront?: ServiceConfigItem<CloudFrontSubmitConfig>[]  // 🆕
  ec2?: ServiceConfigItem<EC2SubmitConfig>[]                // 🆕
}

export type ServiceType = 's3' | 'cloudFront' | 'ec2'
```

### 서비스별 Submit Config

```tsx
// types/aws-services/cloudfront/cloudfront-submit-config.types.ts
export interface CloudFrontSubmitConfig {
  _type: 'cloudFront'
  name: string
  // ... CloudFront 설정
}

// types/aws-services/ec2/ec2-submit-config.types.ts
export interface EC2SubmitConfig {
  _type: 'ec2'
  name: string
  // ... EC2 설정
}
```

---

## 📝 커밋 히스토리

| 커밋 | 설명 | 변경 |
|------|------|------|
| `e45a850` | refactor: service-renderer 디렉토리 삭제 | -844 lines |
| `92d1405` | fix: AwsDiagram props를 optional로 변경 | hero.section.tsx 호환 |
| `6bb975a` | fix: S3 versioning 타입 불일치 수정 | versioningEnabled → enabled |
| `22ebb31` | refactor: adapters 디렉토리 삭제 | -130 lines |
| `3777d6c` | refactor: submitConfig 타입 정의 추가 | CloudFront, EC2 타입 |
| `3b35bf6` | refactor: AWS 컴포넌트 onSubmit 패턴 적용 | 7개 컴포넌트 |
| `1c39ea2` | refactor: problem 폼 레이아웃 및 Context 연결 | layout.tsx 삭제 |

---

## ✅ 핵심 변경사항 요약

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| Registry 개수 | 2개 (AWS_SERVICE + RENDERER) | 1개 (AWS_SERVICE만) |
| 다이어그램 렌더링 | 각 Renderer에서 개별 렌더링 | DiagramPanel에서 통합 |
| 컴포넌트 의존성 | Context 직접 접근 | onSubmit props 주입 |
| 어댑터 레이어 | 존재 | 제거 |
| 코드량 | - | **-974 lines** |

---

## 🔍 검증 방법

```bash
# 빌드 확인
pnpm --filter web build

# 린트 확인
pnpm --filter web lint

# 문제 풀이 페이지에서 폼 + 다이어그램 동작 확인
# /problems/[id] 페이지 테스트
```
