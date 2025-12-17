export const CATEGORY = {
  ALL: 'all',
  SCENARIO: 'scenario',
  STEP: 'step',
} as const;

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export interface Problem {
  id: string;
  title: string;
  category: Category;
  level?: number;
  description: string;
  prerequisites: string[];
  initialNodes?: InitialNodes[];
  initialEdges?: InitialEdges[];
  solution: {
    instanceType?: string;
    amiId?: string;
    vpcId?: string;
    subnetId?: string;
    securityGroupId?: string;
    iamRole?: string;
  };
}

export interface InitialNodes {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; type: string; status: string };
}

export interface InitialEdges {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}
