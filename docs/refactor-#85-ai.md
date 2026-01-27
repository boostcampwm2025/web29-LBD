## 🏗️ Renderer 포함 전체 구조

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           /problems/[id]/page.tsx (Server Component)             │
│                                                                                  │
│   const problemData = await getProblemData(id)  ◄── 서버에서 데이터 fetch         │
│                                                                                  │
│   return <ProblemDetailClient problemData={problemData} />                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    ProblemDetailClient (Client Component)                        │
│                                                                                  │
│   ┌───────────────────────────────────────────────────────────────────────────┐ │
│   │                        UnitFormProvider                                    │ │
│   │                                                                           │ │
│   │   const form = useForm({ defaultValues })   ◄── 여기서 useForm!           │ │
│   │                                                                           │ │
│   │   <FormContext.Provider value={{ control, setValue, watch, handleSubmit }}>│ │
│   │     {children}                                                            │ │
│   │   </FormContext.Provider>                                                 │ │
│   └───────────────────────────────────────────────────────────────────────────┘ │
│                                        │                                         │
│              ┌─────────────────────────┴─────────────────────────┐               │
│              │                                                   │               │
│              ▼                                                   ▼               │
│   ┌─────────────────────────┐                    ┌─────────────────────────┐    │
│   │     스크롤 영역 (Left)    │                    │    스티키 영역 (Right)   │    │
│   │                         │                    │                         │    │
│   │  ┌───────────────────┐  │                    │  ┌───────────────────┐  │    │
│   │  │  ProblemHeader    │  │                    │  │   SubmitButton    │  │    │
│   │  │  (문제 설명)       │  │                    │  │   handleSubmit()  │  │    │
│   │  └───────────────────┘  │                    │  └───────────────────┘  │    │
│   │           │             │                    │           │             │    │
│   │           ▼             │                    │           ▼             │    │
│   │  ┌───────────────────┐  │                    │  ┌───────────────────┐  │    │
│   │  │  ServiceRenderer  │  │                    │  │   DiagramPanel    │  │    │
│   │  │  (폼 렌더링)       │  │  ──── watch() ───▶ │  │   watch(formData) │  │    │
│   │  └───────────────────┘  │                    │  └───────────────────┘  │    │
│   │                         │                    │           │             │    │
│   │                         │                    │           ▼             │    │
│   │                         │                    │  ┌───────────────────┐  │    │
│   │                         │                    │  │  FeedbackPanel    │  │    │
│   │                         │                    │  │  (제출 후 피드백)   │  │    │
│   │                         │                    │  └───────────────────┘  │    │
│   └─────────────────────────┘                    └─────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📁 파일 구조

```
apps/web/src/app/(guest)/problems/[id]/
├── page.tsx                      # Server Component (데이터 fetch)
├── problem-detail-client.tsx     # Client Component (레이아웃 + Provider)
│
├── components/
│   ├── unit-form-provider.tsx    # useForm + Context Provider
│   ├── service-renderer.tsx      # 서비스 컴포넌트 렌더링
│   ├── problem-header.tsx        # 문제 설명 헤더
│   │
│   └── sticky/
│       ├── submit-button.tsx     # 제출 버튼
│       ├── diagram-panel.tsx     # 다이어그램
│       └── feedback-panel.tsx    # 피드백
```

## 🔍 각 컴포넌트 역할

### 1️⃣UnitFormProvider - Form 상태 관리

###

```tsx
// components/unit-form-provider.tsx
"use client";

import { createContext, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

interface UnitFormContextValue {
    form: UseFormReturn<any>;
    problemData: ProblemData;
}

const UnitFormContext = createContext<UnitFormContextValue | null>(null);

export function useUnitForm() {
    const context = useContext(UnitFormContext);
    if (!context) throw new Error("UnitFormProvider 안에서 사용해야 합니다");
    return context;
}

interface Props {
    problemData: ProblemData;
    children: React.ReactNode;
}

export function UnitFormProvider({ problemData, children }: Props) {
    const form = useForm({
        defaultValues: generateDefaultValues(problemData.requiredFields),
    });

    return (
        <UnitFormContext.Provider value={{ form, problemData }}>
            {children}
        </UnitFormContext.Provider>
    );
}
```

### 2️⃣ ProblemDetailClient - 레이아웃 + Provider

```tsx
// problem-detail-client.tsx
"use client";

import { UnitFormProvider } from "./components/unit-form-provider";
import { ServiceRenderer } from "./components/service-renderer";
import { ProblemHeader } from "./components/problem-header";
import { SubmitButton } from "./components/sticky/submit-button";
import { DiagramPanel } from "./components/sticky/diagram-panel";
import { FeedbackPanel } from "./components/sticky/feedback-panel";

interface Props {
    problemData: ProblemData;
}

export default function ProblemDetailClient({ problemData }: Props) {
    return (
        <UnitFormProvider problemData={problemData}>
            <div className="grid grid-cols-[1fr,400px] gap-6">
                {/* 왼쪽: 스크롤 영역 */}
                <div className="space-y-6 overflow-y-auto">
                    <ProblemHeader problem={problemData} />
                    <ServiceRenderer
                        requiredFields={problemData.requiredFields}
                    />
                </div>

                {/* 오른쪽: 스티키 영역 */}
                <div className="sticky top-24 h-fit space-y-4">
                    <SubmitButton />
                    <DiagramPanel />
                    <FeedbackPanel />
                </div>
            </div>
        </UnitFormProvider>
    );
}
```

### 3️⃣ServiceRenderer - 핵심 렌더러!

```tsx
// components/service-renderer.tsx
"use client";

import { useUnitForm } from "./unit-form-provider";
import { getServiceComponent } from "@/components/aws-services/registry";

interface Props {
    requiredFields: RequiredField[];
}

export function ServiceRenderer({ requiredFields }: Props) {
    const { form } = useUnitForm();
    const { control, setValue } = form;

    return (
        <div className="space-y-8">
            {requiredFields.map((field) => {
                const Component = getServiceComponent(
                    field.service,
                    field.serviceTask,
                );
                const formPrefix = `${field.service}-${field.serviceTask}`;

                // sections를 config로 변환
                const config = field.serviceSections.reduce(
                    (acc, section) => {
                        acc[section] = true;
                        return acc;
                    },
                    {} as Record<string, boolean>,
                );

                return (
                    <Component
                        key={formPrefix}
                        control={control}
                        setValue={setValue}
                        config={config}
                        formPrefix={formPrefix}
                    />
                );
            })}
        </div>
    );
}
```

### 4️⃣SubmitButton - 통합 제출

```tsx
// components/sticky/submit-button.tsx
"use client";

import { useUnitForm } from "../unit-form-provider";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
    const { form, problemData } = useUnitForm();
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: unknown) => {
        console.log("통합 제출 데이터:", data);

        // API 호출
        await fetch("/api/solutions", {
            method: "POST",
            body: JSON.stringify({
                problemId: problemData.id,
                answer: data,
            }),
        });
    };

    return (
        <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
        >
            {isSubmitting ? "제출 중..." : "제출하기"}
        </Button>
    );
}
```

### 5️⃣DiagramPanel - Form 실시간 구독

```tsx
// components/sticky/diagram-panel.tsx
'use client'

import { useUnitForm } from '../unit-form-provider'
import { useMemo } from 'react'
import { ReactFlow } from '@xyflow/react'

export function DiagramPanel() {
  const { form, problemData } = useUnitForm()

  // form 데이터 구독 (실시간 업데이트)
  const formData = form.watch()

  // formData 기반으로 노드 생성
  const { nodes, edges } = useMemo(() =>
    generateDiagram(problemData.requiredFields, formData),
    [problemData, formData]
  )

  return (
    <div className="h-[400px] rounded-xl border">
      <ReactFlow nodes={nodes} edges={edges} ... />
    </div>
  )
}
```

## 📊 데이터 흐름 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              데이터 흐름                                          │
└─────────────────────────────────────────────────────────────────────────────────┘

     page.tsx                     UnitFormProvider                    컴포넌트들
        │                               │                                 │
        │  problemData                  │                                 │
        │────────────────────────────▶  │                                 │
        │                               │                                 │
        │                     ┌─────────┴─────────┐                       │
        │                     │    useForm()      │                       │
        │                     │   defaultValues   │                       │
        │                     └─────────┬─────────┘                       │
        │                               │                                 │
        │                               │  Context (form)                 │
        │                               │─────────────────────────────▶   │
        │                               │                                 │
        │                               │                     ┌───────────┴───────────┐
        │                               │                     │                       │
        │                               │              ServiceRenderer         DiagramPanel
        │                               │                     │                       │
        │                               │              control, setValue        watch()
        │                               │                     │                       │
        │                               │                     ▼                       │
        │                               │              ┌─────────────┐                │
        │                               │              │  S3Bucket   │                │
        │                               │              │  CloudFront │                │
        │                               │              └─────────────┘                │
        │                               │                     │                       │
        │                               │            user input │                     │
        │                               │                     ▼                       │
        │                               │◀─────────── form 상태 업데이트 ──────────────│
        │                               │                                             │
        │                               │──────────── watch() 트리거 ─────────────────▶│
        │                               │                                             │
        │                               │                                   다이어그램 업데이트
        │                               │                                             │
        │                               │                                             │
        │                     ┌─────────┴─────────┐                                   │
        │                     │   SubmitButton    │                                   │
        │                     │  handleSubmit()   │                                   │
        │                     └─────────┬─────────┘                                   │
        │                               │                                             │
        │                               ▼                                             │
        │                        API 제출 (통합 데이터)                                  │
        │                                                                             │
```

## 핵심 포인트

| 질문                | 답변                                           |
| ------------------- | ---------------------------------------------- |
| useForm 어디에?     | UnitFormProvider에서 한 번만 생성              |
| detail-client 역할? | 레이아웃 + Provider 감싸기                     |
| Renderer 역할?      | requiredFields 순회하며 컴포넌트 매핑 & 렌더링 |
| Sticky 영역?        | Context를 통해 form 접근 (watch, handleSubmit) |

## 정리

```tsx
// 계층 구조
<UnitFormProvider>
    {" "}
    // useForm 생성 + Context 제공
    <Layout>
        <ServiceRenderer /> // 폼 컴포넌트 렌더링 (control 사용)
        <SubmitButton /> // handleSubmit 사용
        <DiagramPanel /> // watch 사용
    </Layout>
</UnitFormProvider>
```
