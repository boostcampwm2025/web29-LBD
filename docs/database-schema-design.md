# CloudCraft 데이터베이스 스키마 설계 문서

## 문서 정보

- **작성일**: 2026-01-04
- **버전**: 2.0
- **대상 독자**: 백엔드 개발자, 데이터베이스 관리자

---

## 목차

1. [개요](#개요)
2. [설계 원칙](#설계-원칙)
3. [핵심 개념](#핵심-개념)
4. [테이블 구조](#테이블-구조)
5. [관계도 (ERD)](#관계도-erd)
6. [검증 시스템](#검증-시스템)
7. [다이어그램 렌더링 전략](#다이어그램-렌더링-전략)
8. [사용 예시](#사용-예시)

---

## 개요

CloudCraft는 **AWS 클라우드 서비스 학습 플랫폼**으로, 사용자가 실제 AWS 계정 없이 클라우드 아키텍처를 설계하고 검증할 수 있는 시뮬레이션 환경을 제공합니다.

### 주요 기능

- AWS 서비스(EC2, VPC, S3, CloudFront 등)의 웹 기반 UI 제공
- 사용자 입력에 따른 실시간 아키텍처 다이어그램 생성
- 답안 검증 및 피드백 (단순 값 비교 + 그래프 기반 접근성 분석)
- 학습 경로 추적 및 진행 상황 관리

---

## 설계 원칙

### 1. 문제 유형 계층 구조

```
Unit (단위 문제)
  ↓
Cookbook (요리책 문제) = Unit 문제들의 조합
  ↓
Scenario (시나리오 문제) = 복합적인 실무 상황
```

- **Unit**: 단일 AWS 서비스 설정 (예: EC2 인스턴스 생성)
- **Cookbook**: 여러 Unit을 순차적으로 조합 (예: S3 + CloudFront 배포)
- **Scenario**: 복잡한 실무 문제 (예: 3-tier 웹 애플리케이션 구축)

### 2. 검증 방식

- **Exact Match**: Unit 문제의 단순 값 비교
- **Graph Validation**: 네트워크 접근성 검증 (DFS/BFS)
- **Custom Logic**: 복잡한 비즈니스 규칙

### 3. 다이어그램 렌더링

- **DB**: 다이어그램 생성 규칙(템플릿)만 저장
- **클라이언트**: React Flow를 사용한 동적 렌더링
- **장점**: 유연성, 실시간 업데이트, 예상치 못한 사용자 입력 처리

---

## 핵심 개념

### Problem Type (문제 유형)

| 타입 | 설명 | 구성 |
|------|------|------|
| `unit` | 단일 서비스 설정 문제 | 독립적인 문제 |
| `cookbook` | 여러 Unit의 조합 | Unit 문제들의 시퀀스 |
| `scenario` | 복합 실무 문제 | 자유 형식 |

### Service Type (서비스 종류)

- `ec2`: EC2 인스턴스
- `vpc`: Virtual Private Cloud
- `s3`: Simple Storage Service
- `cloudfront`: Content Delivery Network
- `s3-cloudfront`: S3 + CloudFront 조합
- `rds`: Relational Database Service
- (기타 AWS 서비스 추가 가능)

### Validation Type (검증 타입)

| 타입 | 설명 | 사용 사례 |
|------|------|----------|
| `exact` | 정확한 값 일치 | 인스턴스 타입, 리전 선택 |
| `regex` | 정규식 패턴 매칭 | VPC ID, 버킷 이름 형식 |
| `graph` | 그래프 탐색 검증 | 네트워크 접근성, 트래픽 흐름 |
| `custom` | 커스텀 함수 | 복잡한 비즈니스 로직 |

---

## 테이블 구조

### 1. problem (문제)

문제의 기본 정보를 저장합니다.

```sql
CREATE TABLE `problem` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `problem_type` ENUM('unit', 'cookbook', 'scenario') NOT NULL,
  `service_type` varchar(50) NOT NULL COMMENT 'AWS 서비스 종류',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `difficulty` ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
  `estimated_time` int COMMENT '예상 소요 시간(분)',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP
);
```

**주요 필드 설명**:
- `problem_type`: 문제 유형 (unit/cookbook/scenario)
- `service_type`: AWS 서비스 종류 (ec2, s3, vpc 등)
- `difficulty`: 난이도 (초급/중급/고급)
- `estimated_time`: 예상 소요 시간 (분 단위)

---

### 2. cookbook_composition (쿡북 구성)

Cookbook 문제가 어떤 Unit 문제들로 구성되는지 정의합니다.

```sql
CREATE TABLE `cookbook_composition` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cookbook_id` int NOT NULL COMMENT 'Cookbook 문제 ID',
  `unit_problem_id` int NOT NULL COMMENT '포함된 Unit 문제 ID',
  `step_order` int NOT NULL COMMENT '단계 순서 (1부터 시작)',
  `is_required` boolean DEFAULT true COMMENT '필수 단계 여부',
  FOREIGN KEY (`cookbook_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`unit_problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_cookbook_step` (`cookbook_id`, `step_order`)
);
```

**사용 예시**:
```
Cookbook: "React 앱 S3 + CloudFront 배포"
  ↓ step_order: 1
Unit: "S3 정적 웹사이트 호스팅"
  ↓ step_order: 2
Unit: "CloudFront 배포 설정"
```

---

### 3. problem_field (문제 입력 필드)

각 문제에서 사용자가 입력해야 하는 필드를 정의합니다.

```sql
CREATE TABLE `problem_field` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `problem_id` int NOT NULL,
  `field_order` int NOT NULL COMMENT '필드 표시 순서',
  `field_key` varchar(100) NOT NULL COMMENT '프로그래밍 key (예: instanceType)',
  `field_label` varchar(255) NOT NULL COMMENT 'UI 라벨 (예: 인스턴스 타입)',
  `ui_component` ENUM('select', 'input', 'checkbox', 'radio', 'textarea', 'multi-select') NOT NULL,
  `options` JSON COMMENT 'select/radio의 선택지 배열',
  `placeholder` varchar(255),
  `help_text` text COMMENT '필드 설명',
  `is_required` boolean DEFAULT true,
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_problem_field` (`problem_id`, `field_key`)
);
```

**options JSON 예시**:
```json
["t2.micro", "t2.small", "t2.medium", "t2.large"]
```

**주요 필드 설명**:
- `field_key`: 백엔드에서 사용하는 키 (camelCase)
- `field_label`: 사용자에게 표시되는 라벨
- `ui_component`: 렌더링할 UI 컴포넌트 타입
- `options`: select/radio의 경우 선택 가능한 옵션들

---

### 4. field_validation (필드 검증)

각 필드의 검증 규칙과 피드백 메시지를 저장합니다.

```sql
CREATE TABLE `field_validation` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `field_id` int NOT NULL,
  `validation_type` ENUM('exact', 'regex', 'graph', 'custom') NOT NULL,
  `validation_config` JSON NOT NULL COMMENT '검증 설정',
  `success_message` text,
  `error_message` text NOT NULL,
  `hint` text COMMENT '힌트',
  FOREIGN KEY (`field_id`) REFERENCES `problem_field` (`id`) ON DELETE CASCADE
);
```

**validation_config 예시**:

#### Exact Match (정확한 값 비교)
```json
{
  "correctValue": "t2.micro"
}
```

#### Regex (정규식 검증)
```json
{
  "pattern": "^vpc-[a-z0-9]{8}$",
  "flags": "i"
}
```

#### Graph (그래프 검증 - DFS/BFS)
```json
{
  "graphType": "network-access",
  "startNode": "internet-gateway",
  "endNode": "ec2-instance",
  "requiredPath": ["igw", "route-table", "subnet", "security-group", "ec2"],
  "errorDetails": {
    "missingComponent": "Internet Gateway를 VPC에 연결해야 합니다.",
    "blockedPath": "Security Group에서 인바운드 규칙을 확인하세요."
  }
}
```

#### Custom (커스텀 함수)
```json
{
  "functionName": "validateS3BucketPolicy",
  "params": {
    "allowPublicRead": true
  }
}
```

---

### 5. solution (정답)

각 문제의 모범 답안을 저장합니다.

```sql
CREATE TABLE `solution` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `problem_id` int NOT NULL,
  `config_type` varchar(50) NOT NULL COMMENT '설정 유형',
  `config_info` JSON NOT NULL COMMENT '전체 정답 구성',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE
);
```

**config_info 예시**:
```json
{
  "instanceType": "t2.micro",
  "amiId": "ami-amazon-linux-2",
  "vpcId": "vpc-default",
  "subnetId": "subnet-public-1a",
  "securityGroupId": "sg-web-server",
  "securityGroupRules": {
    "inbound": [
      { "port": 80, "source": "0.0.0.0/0", "protocol": "tcp" },
      { "port": 443, "source": "0.0.0.0/0", "protocol": "tcp" }
    ]
  },
  "iamRole": "EC2-S3-ReadOnly"
}
```

---

### 6. diagram_template (다이어그램 템플릿) - 선택적

다이어그램 생성 규칙을 저장합니다. (실제 렌더링은 클라이언트에서 동적 생성)

```sql
CREATE TABLE `diagram_template` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `service_type` varchar(50) NOT NULL COMMENT '서비스 종류',
  `layout_config` JSON COMMENT 'React Flow 레이아웃 설정',
  `node_rules` JSON COMMENT '노드 생성 규칙',
  `edge_rules` JSON COMMENT '엣지 생성 규칙',
  UNIQUE KEY `unique_service_template` (`service_type`)
);
```

**node_rules 예시**:
```json
{
  "vpc": {
    "type": "container",
    "position": "start",
    "required": true,
    "style": { "width": 800, "height": 600 }
  },
  "ec2": {
    "type": "instance",
    "dependsOn": "vpc",
    "position": "center",
    "icon": "ec2-icon"
  },
  "securityGroup": {
    "type": "boundary",
    "attachTo": "ec2"
  }
}
```

**edge_rules 예시**:
```json
{
  "internetGateway-to-vpc": {
    "condition": "hasInternetGateway === true",
    "animated": true,
    "label": "외부 트래픽"
  },
  "vpc-to-ec2": {
    "condition": "ec2.vpcId === vpc.id",
    "style": "dashed"
  }
}
```

---

### 7. user (사용자)

```sql
CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 8. user_progress (사용자 진행 상황) - 향후 추가 예정

```sql
CREATE TABLE `user_progress` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `problem_id` int NOT NULL,
  `status` ENUM('not_started', 'in_progress', 'completed', 'failed') DEFAULT 'not_started',
  `score` int COMMENT '점수',
  `time_spent` int COMMENT '소요 시간(초)',
  `attempts` int DEFAULT 0 COMMENT '시도 횟수',
  `completed_at` datetime,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_problem` (`user_id`, `problem_id`)
);
```

---

### 9. user_submission (사용자 제출 답안) - 향후 추가 예정

```sql
CREATE TABLE `user_submission` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `problem_id` int NOT NULL,
  `submitted_config` JSON NOT NULL COMMENT '제출한 설정',
  `is_correct` boolean NOT NULL,
  `validation_result` JSON COMMENT '검증 결과 상세',
  `submitted_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE
);
```

---

## 관계도 (ERD)

```
┌─────────────┐
│   user      │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────┴──────────┐         ┌─────────────────┐
│  user_progress  │         │    problem      │
│  user_submission│         │  (unit/cookbook)│
└─────────────────┘         └────────┬────────┘
                                     │ 1
                    ┌────────────────┼────────────────┐
                    │                │                │
                    │ N              │ 1              │ N
            ┌───────┴────────┐  ┌───┴────────┐  ┌────┴─────────────┐
            │ problem_field  │  │  solution  │  │cookbook_composition│
            └───────┬────────┘  └────────────┘  └────┬─────────────┘
                    │ 1                              │
                    │                                │ N
                    │ N                     ┌────────┴─────────┐
            ┌───────┴──────────┐            │ problem (unit)   │
            │field_validation  │            └──────────────────┘
            └──────────────────┘

┌──────────────────┐
│diagram_template  │ (독립적, service_type 기준)
└──────────────────┘
```

### 주요 관계

1. **Problem → Problem Field** (1:N)
   - 하나의 문제는 여러 입력 필드를 가짐

2. **Problem Field → Field Validation** (1:N)
   - 하나의 필드는 여러 검증 규칙을 가질 수 있음

3. **Problem → Solution** (1:1)
   - 하나의 문제는 하나의 정답을 가짐

4. **Cookbook Problem → Unit Problems** (N:N via cookbook_composition)
   - Cookbook은 여러 Unit 문제로 구성됨

5. **User → Problem** (N:N via user_progress/user_submission)
   - 사용자는 여러 문제를 풀 수 있음

---

## 검증 시스템

### 1. Exact Match 검증

가장 단순한 형태로, 사용자 입력과 정답을 직접 비교합니다.

```typescript
// Backend 구현 예시
function validateExact(
  userValue: string,
  config: { correctValue: string }
): ValidationResult {
  const isCorrect = userValue === config.correctValue;

  return {
    isValid: isCorrect,
    message: isCorrect
      ? '정답입니다!'
      : `올바른 값은 "${config.correctValue}"입니다.`
  };
}
```

**사용 사례**:
- 인스턴스 타입 선택 (t2.micro, t2.small 등)
- 리전 선택 (us-east-1, ap-northeast-2 등)
- 고정된 설정 값

---

### 2. Regex 검증

패턴 매칭을 통해 형식을 검증합니다.

```typescript
function validateRegex(
  userValue: string,
  config: { pattern: string; flags?: string }
): ValidationResult {
  const regex = new RegExp(config.pattern, config.flags);
  const isValid = regex.test(userValue);

  return {
    isValid,
    message: isValid
      ? '올바른 형식입니다.'
      : '형식이 올바르지 않습니다. 예: vpc-1a2b3c4d'
  };
}
```

**사용 사례**:
- VPC ID 형식 검증 (`vpc-[a-z0-9]{8}`)
- S3 버킷 이름 검증 (소문자, 숫자, 하이픈만 허용)
- ARN 형식 검증

---

### 3. Graph 검증 (네트워크 접근성)

AWS Access Analyzer와 유사하게 네트워크 경로를 그래프로 모델링하고 DFS/BFS로 검증합니다.

#### 그래프 구성 예시

```typescript
interface NetworkGraph {
  nodes: Map<string, Node>;
  edges: Edge[];
}

interface Node {
  id: string;
  type: 'vpc' | 'igw' | 'ec2' | 'sg' | 'subnet' | 'route-table';
  config: any;
}

interface Edge {
  from: string;
  to: string;
  port?: number;
  protocol?: string;
}

// 사용자 입력으로 그래프 생성
function buildNetworkGraph(userInputs: ProblemAnswer): NetworkGraph {
  const graph: NetworkGraph = {
    nodes: new Map(),
    edges: []
  };

  // VPC 노드 추가
  if (userInputs.vpcId) {
    graph.nodes.set('vpc', {
      id: userInputs.vpcId,
      type: 'vpc',
      config: {}
    });
  }

  // Internet Gateway 추가
  if (userInputs.hasInternetGateway) {
    graph.nodes.set('igw', {
      id: 'igw-1',
      type: 'igw',
      config: {}
    });

    // Internet → IGW → VPC 엣지
    graph.edges.push(
      { from: 'internet', to: 'igw' },
      { from: 'igw', to: 'vpc' }
    );
  }

  // Route Table 추가
  if (userInputs.routeTable) {
    graph.nodes.set('route-table', {
      id: userInputs.routeTable.id,
      type: 'route-table',
      config: userInputs.routeTable
    });

    // 라우팅 규칙에 따라 엣지 추가
    if (userInputs.routeTable.routes.includes('0.0.0.0/0 -> igw')) {
      graph.edges.push({ from: 'igw', to: 'route-table' });
    }
  }

  // Security Group 추가
  if (userInputs.securityGroup) {
    const sg = userInputs.securityGroup;

    // 인바운드 규칙에 따라 엣지 추가
    sg.inboundRules.forEach(rule => {
      if (rule.source === '0.0.0.0/0') {
        graph.edges.push({
          from: 'internet',
          to: 'ec2',
          port: rule.port,
          protocol: rule.protocol
        });
      }
    });
  }

  // EC2 추가
  if (userInputs.instanceId) {
    graph.nodes.set('ec2', {
      id: userInputs.instanceId,
      type: 'ec2',
      config: {}
    });
  }

  return graph;
}
```

#### DFS 검증

```typescript
function validateNetworkAccess(
  userInputs: ProblemAnswer,
  config: GraphValidationConfig
): ValidationResult {
  const graph = buildNetworkGraph(userInputs);

  // DFS로 경로 탐색
  const path = dfs(graph, config.startNode, config.endNode);

  if (!path) {
    // 접근 불가능 - 어느 부분이 막혔는지 분석
    const missingComponents = findMissingComponents(
      graph,
      config.requiredPath
    );

    return {
      isValid: false,
      message: `${config.endNode}에 접근할 수 없습니다.`,
      errors: missingComponents.map(comp => ({
        component: comp,
        message: `${comp}이(가) 올바르게 설정되지 않았습니다.`
      }))
    };
  }

  // 경로는 존재하지만 필수 구성 요소가 있는지 확인
  if (config.requiredPath) {
    const missingInPath = config.requiredPath.filter(
      node => !path.includes(node)
    );

    if (missingInPath.length > 0) {
      return {
        isValid: false,
        message: '경로는 존재하지만 권장 구성과 다릅니다.',
        warnings: missingInPath.map(node =>
          `${node}을(를) 경로에 포함하는 것을 권장합니다.`
        )
      };
    }
  }

  return {
    isValid: true,
    message: '올바른 네트워크 구성입니다!',
    path: path
  };
}

function dfs(
  graph: NetworkGraph,
  start: string,
  end: string,
  visited = new Set<string>(),
  path: string[] = []
): string[] | null {
  if (start === end) {
    return [...path, end];
  }

  visited.add(start);
  path.push(start);

  const outgoingEdges = graph.edges.filter(e => e.from === start);

  for (const edge of outgoingEdges) {
    if (!visited.has(edge.to)) {
      const result = dfs(graph, edge.to, end, visited, [...path]);
      if (result) return result;
    }
  }

  return null;
}
```

**사용 사례**:
- "외부 인터넷에서 EC2 인스턴스로 HTTP 접근이 가능한가?"
- "VPC 내부의 DB에서 S3로 데이터를 전송할 수 있는가?"
- "NAT Gateway를 통해 프라이빗 서브넷이 인터넷에 접근할 수 있는가?"

---

### 4. Custom 검증

복잡한 비즈니스 로직을 함수로 구현합니다.

```typescript
// 커스텀 검증 함수 레지스트리
const customValidators = {
  validateS3BucketPolicy: (userValue: any, params: any) => {
    // S3 버킷 정책 검증 로직
    const policy = JSON.parse(userValue);

    if (params.allowPublicRead) {
      const hasPublicRead = policy.Statement.some(
        s => s.Effect === 'Allow' &&
             s.Principal === '*' &&
             s.Action.includes('s3:GetObject')
      );

      if (!hasPublicRead) {
        return {
          isValid: false,
          message: '정적 웹사이트 호스팅을 위해 퍼블릭 읽기 권한이 필요합니다.'
        };
      }
    }

    return { isValid: true };
  },

  validateIAMRolePolicy: (userValue: any, params: any) => {
    // IAM 역할 정책 검증
    // ...
  }
};

function validateCustom(
  userValue: any,
  config: { functionName: string; params: any }
): ValidationResult {
  const validator = customValidators[config.functionName];

  if (!validator) {
    throw new Error(`Unknown validator: ${config.functionName}`);
  }

  return validator(userValue, config.params);
}
```

---

## 다이어그램 렌더링 전략

### 설계 방침

**DB 저장**: 다이어그램 생성 규칙(템플릿)만 저장
**렌더링**: 클라이언트에서 React Flow를 사용하여 동적 생성

### 장점

1. **유연성**: 사용자가 예상치 못한 입력을 해도 즉시 반영
2. **확장성**: 새로운 AWS 서비스 추가 시 템플릿만 추가
3. **실시간**: 사용자 입력 변경 → 즉시 다이어그램 업데이트
4. **저장 공간**: DB에 매번 다이어그램 저장 불필요

### 클라이언트 구현 예시

```typescript
// React Flow 동적 생성
function generateDiagram(
  userInputs: ProblemAnswer,
  template: DiagramTemplate
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 템플릿 기반 노드 생성
  Object.entries(template.nodeRules).forEach(([nodeType, rule]) => {
    if (shouldCreateNode(userInputs, rule)) {
      nodes.push({
        id: `${nodeType}-${nodes.length}`,
        type: nodeType,
        data: extractNodeData(userInputs, nodeType),
        position: calculatePosition(nodeType, rule, nodes)
      });
    }
  });

  // 템플릿 기반 엣지 생성
  Object.entries(template.edgeRules).forEach(([edgeType, rule]) => {
    if (shouldCreateEdge(userInputs, rule, nodes)) {
      edges.push({
        id: `edge-${edges.length}`,
        source: rule.source,
        target: rule.target,
        animated: rule.animated,
        label: rule.label
      });
    }
  });

  return { nodes, edges };
}

// 사용자 입력에 따라 노드 생성 여부 결정
function shouldCreateNode(
  userInputs: ProblemAnswer,
  rule: NodeRule
): boolean {
  if (rule.required) return true;

  // 조건부 노드 (예: Internet Gateway는 hasInternetGateway가 true일 때만)
  if (rule.condition) {
    return evaluateCondition(userInputs, rule.condition);
  }

  return false;
}
```

### 다이어그램 템플릿 예시

```json
{
  "service_type": "ec2-vpc",
  "layout_config": {
    "direction": "horizontal",
    "spacing": 100
  },
  "node_rules": {
    "internet": {
      "type": "cloud",
      "required": true,
      "position": { "x": 0, "y": 200 },
      "style": { "icon": "cloud-icon" }
    },
    "igw": {
      "type": "gateway",
      "required": false,
      "condition": "hasInternetGateway === true",
      "position": { "x": 200, "y": 200 }
    },
    "vpc": {
      "type": "container",
      "required": true,
      "position": { "x": 400, "y": 100 },
      "style": { "width": 600, "height": 400 }
    },
    "ec2": {
      "type": "instance",
      "required": true,
      "position": "relative-to-vpc",
      "offsetX": 100,
      "offsetY": 100
    }
  },
  "edge_rules": {
    "internet-to-igw": {
      "source": "internet",
      "target": "igw",
      "condition": "hasInternetGateway === true",
      "animated": true,
      "label": "외부 요청"
    },
    "igw-to-vpc": {
      "source": "igw",
      "target": "vpc",
      "condition": "hasInternetGateway === true"
    },
    "vpc-to-ec2": {
      "source": "vpc",
      "target": "ec2",
      "style": "dashed"
    }
  }
}
```

---

## 사용 예시

### 예시 1: Unit 문제 생성 - EC2 인스턴스 설정

#### 1. Problem 생성
```sql
INSERT INTO problem (problem_type, service_type, title, description, difficulty, estimated_time)
VALUES (
  'unit',
  'ec2',
  'EC2 인스턴스 생성하기',
  '기본 웹 서버용 EC2 인스턴스를 생성합니다. 프리티어 인스턴스를 사용하고, 퍼블릭 서브넷에 배치하세요.',
  'beginner',
  10
);
-- problem_id: 1
```

#### 2. Problem Fields 생성
```sql
-- 인스턴스 타입 선택
INSERT INTO problem_field (problem_id, field_order, field_key, field_label, ui_component, options, is_required)
VALUES (
  1,
  1,
  'instanceType',
  '인스턴스 타입',
  'select',
  '["t2.micro", "t2.small", "t2.medium"]',
  true
);
-- field_id: 1

-- VPC 선택
INSERT INTO problem_field (problem_id, field_order, field_key, field_label, ui_component, options, help_text, is_required)
VALUES (
  1,
  2,
  'vpcId',
  'VPC',
  'select',
  '["vpc-default", "vpc-custom"]',
  '인스턴스가 배치될 VPC를 선택합니다.',
  true
);
-- field_id: 2
```

#### 3. Field Validation 생성
```sql
-- 인스턴스 타입 검증
INSERT INTO field_validation (field_id, validation_type, validation_config, success_message, error_message, hint)
VALUES (
  1,
  'exact',
  '{"correctValue": "t2.micro"}',
  '정답입니다! 프리티어에서는 t2.micro를 사용합니다.',
  't2.micro를 선택해야 합니다.',
  '프리티어에서는 어떤 인스턴스 타입을 무료로 사용할 수 있을까요?'
);

-- VPC 검증
INSERT INTO field_validation (field_id, validation_type, validation_config, error_message)
VALUES (
  2,
  'exact',
  '{"correctValue": "vpc-default"}',
  '기본 VPC를 선택해야 합니다.'
);
```

#### 4. Solution 생성
```sql
INSERT INTO solution (problem_id, config_type, config_info)
VALUES (
  1,
  'ec2-basic',
  '{
    "instanceType": "t2.micro",
    "vpcId": "vpc-default",
    "subnetId": "subnet-public-1a",
    "securityGroupId": "sg-default"
  }'
);
```

---

### 예시 2: Cookbook 문제 생성 - S3 + CloudFront 배포

#### 1. Unit 문제 생성 (S3)
```sql
INSERT INTO problem (problem_type, service_type, title, description, difficulty, estimated_time)
VALUES (
  'unit',
  's3',
  'S3 정적 웹사이트 호스팅',
  'S3 버킷을 생성하고 정적 웹사이트 호스팅을 설정합니다.',
  'beginner',
  15
);
-- problem_id: 2
```

#### 2. Unit 문제 생성 (CloudFront)
```sql
INSERT INTO problem (problem_type, service_type, title, description, difficulty, estimated_time)
VALUES (
  'unit',
  'cloudfront',
  'CloudFront 배포 구성',
  'S3를 오리진으로 하는 CloudFront 배포를 생성합니다.',
  'intermediate',
  20
);
-- problem_id: 3
```

#### 3. Cookbook 문제 생성
```sql
INSERT INTO problem (problem_type, service_type, title, description, difficulty, estimated_time)
VALUES (
  'cookbook',
  's3-cloudfront',
  'React 앱 S3 + CloudFront로 배포하기',
  'React 애플리케이션을 S3에 업로드하고 CloudFront를 통해 전 세계에 배포합니다.',
  'intermediate',
  35
);
-- problem_id: 4
```

#### 4. Cookbook 구성
```sql
INSERT INTO cookbook_composition (cookbook_id, unit_problem_id, step_order, is_required)
VALUES
  (4, 2, 1, true),  -- 1단계: S3 설정
  (4, 3, 2, true);  -- 2단계: CloudFront 설정
```

---

### 예시 3: Graph 검증 - 네트워크 접근성

#### Problem Field (Security Group Inbound Rules)
```sql
INSERT INTO problem_field (problem_id, field_order, field_key, field_label, ui_component, help_text, is_required)
VALUES (
  1,
  3,
  'securityGroupInbound',
  '인바운드 규칙',
  'multi-select',
  'EC2 인스턴스로 들어오는 트래픽을 허용할 포트를 선택하세요.',
  true
);
```

#### Graph Validation
```sql
INSERT INTO field_validation (field_id, validation_type, validation_config, error_message, hint)
VALUES (
  3,
  'graph',
  '{
    "graphType": "network-access",
    "startNode": "internet",
    "endNode": "ec2-instance",
    "requiredPath": ["internet", "igw", "route-table", "subnet", "security-group", "ec2"],
    "errorDetails": {
      "missingIGW": "Internet Gateway를 VPC에 연결해야 외부에서 접근할 수 있습니다.",
      "blockedSG": "Security Group에서 HTTP(80) 포트를 허용해야 합니다.",
      "noRoute": "Route Table에 인터넷으로 가는 경로(0.0.0.0/0 -> IGW)를 추가해야 합니다."
    }
  }',
  '외부 인터넷에서 EC2 인스턴스로 접근할 수 없습니다.',
  'Internet Gateway, Route Table, Security Group 설정을 확인하세요.'
);
```

---

## 마이그레이션 작업 순서

### Phase 1: 기존 스키마 수정
1. `problem` 테이블 컬럼명 수정 (`type` → `problem_type`)
2. 누락된 필드 추가 (`difficulty`, `estimated_time`)
3. `solution`, `cheetsheet` 테이블에 timestamps 추가

### Phase 2: 새 테이블 추가
1. `cookbook_composition` 생성
2. `problem_field` 생성
3. `field_validation` 생성
4. `diagram_template` 생성 (선택)

### Phase 3: 데이터 마이그레이션
1. 기존 `cheetsheet_problem` 데이터를 `cookbook_composition`으로 이전
2. 기존 `solution.config_info`를 새 구조로 변환

### Phase 4: 향후 확장
1. `user_progress` 추가
2. `user_submission` 추가
3. 태그/카테고리 시스템

---

## 참고 자료

- [TypeORM Documentation](https://typeorm.io/)
- [React Flow Documentation](https://reactflow.dev/)
- [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)
- [Graph Algorithms (DFS/BFS)](https://en.wikipedia.org/wiki/Graph_traversal)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2024-12-17 | 초기 스키마 생성 |
| 2.0 | 2026-01-04 | Cookbook/Unit 구조 추가, 검증 시스템 고도화, 다이어그램 전략 수립 |

---

## 문의

데이터베이스 스키마 관련 문의사항은 백엔드 팀에 연락주세요.
