import { ValidationHandler } from "./apps/server/src/problems/validation/handlers/validation.handler";
import { SubmitResponseDto } from "src/problems/dto/submit-response.dto";
import { ConfigDto } from "src/problems/dto/submit-request.dto";
import { ProblemType } from "src/problems/types/problem-type.enum";

export class ScenarioValidationHandler implements ValidationHandler {
	support(problemType: ProblemType): boolean {
		return problemType === ProblemType.SCENARIO;
	}

	validate(submitConfig: ConfigDto, problemData: any): SubmitResponseDto {
		return {
			result: "PASS",
			feedback: [],
		};
	}

	private simulateScenarioExecution(
		graph: unknown,
		start: unknown,
		end: unknown,
		task: unknown,
	): unknown {
		const reachabilityTestResult = this.checkReachability();
		// 만약 도달 불가능하다면 바로 피드백 반환
		// if (reachabilityTestResult.passed === false) return reachabilityTestResult;
		const problemConditionTestResult = this.checkProblemConditions();
		// 만약 문제 조건이 충족되지 않았다면 바로 피드백 반환
		// if (problemConditionTestResult.passed === false) return problemConditionTestResult;
		const endpointRuleTestResult = this.checkEndpointRules();
		// 만약 엔드포인트 규칙이 지켜지지 않았다면 바로 피드백 반환
		// if (endpointRuleTestResult.passed === false) return endpointRuleTestResult;
		// 모든 테스트를 통과했다면 성공 피드백 반환
		return {
			passed: true,
			feedback: this.generateFeedback(),
		};
	}
	private buildVPCsGraph(configInfos: ConfigDto[]) {
		// VPCs 그래프를 구축하는 로직
		// 1. 각 VPC를 노드로 추가
		// 2. VPC 피어링 연결을 엣지로 추가
		// 3. TGW 연결을 엣지로 추가
		// 4. 결과 그래프 반환
	}
	private isPublicSubnet() {
		// 해당 서브넷이 퍼블릭 서브넷인지 확인하는 로직
		// 1. 라우팅 테이블에서 인터넷 게이트웨이로 향하는 경로가 있는지 확인
		// 2. 해당 VPC에 인터넷 게이트웨이가 연결되어 있는지 확인
		// 3. 아니면 프라이빗 서브넷
	}
	private findPublicSubnetsAndMembers() {
		// 같은 VPC 내에서 퍼블릭 서브넷들을 찾는 로직
		// 1. VPC를 순회하면서 각 서브넷이 퍼블릭 서브넷인지 확인
		// 2. 퍼블릭 서브넷이면 포함된 인스턴스들을 수집
		// 3. 결과 반환
	}
	private isManagedByLB() {
		// 목적지 프라이빗 서브넷의 인스턴스가 로드밸런서에 의해 관리되는지 확인하는 로직
		// 1. 로드밸런서의 대상 그룹에서 해당 인스턴스가 포함되어 있는지 확인
		// 2. 포함되어 있으면 true, 아니면 false 반환
	}

	private hasNATGateway() {
		// 프라이빗 서브넷에 NAT 게이트웨이가 연결되어 있는지 확인하는 로직
		// 1. 서브넷의 라우팅 테이블에서 NAT 게이트웨이로 향하는 경로가 있는지 확인
		// 2. VPC 내에 해당 NAT 게이트웨이를 가지는 퍼블릭 서브넷이 존재하는지 확인
	}

	private hasNATInOtherVPCs() {
		// 다른 VPC의 NAT 게이트웨이를 경유하는지 확인하는 로직
		// 1. 다른 VPC들의 퍼블릭 서브넷과 NAT 게이트웨이를 확인
		// 2. 빌드한 그래프를 탐색하여 소스 -> 해당 서브넷의 경로가 존재하는지 확인
	}

	private isSameVPC() {
		// 소스와 목적지가 같은 VPC에 속하는지 확인하는 로직
		// 1. 소스와 목적지의 VPC를 비교 후 반환
	}

	private hasPathBetweenVPCs() {
		// 소스와 목적지 VPC 간에 경로가 존재하는지 확인하는 로직
		// 1. 빌드한 그래프를 탐색하여 소스 VPC에서 목적지 VPC로 가는 경로가 존재하는지 확인
		// 2. 탐색할 때는 NACL 등을 고려.
	}

	// TODO: S3, Cloudfront 등 AWS-managed 서비스 경유 로직 또는 직접 연결 로직, 온프렘, 타 클라우드 연결 로직 추가

	private checkReachability() {
		// 접근 가능성 테스트 로직
		// 다음의 경우 구분
		// 1. 인터넷 -> 내부
		// 2. 내부 -> 인터넷
		// 3. 내부 -> 내부
		// 추가. AWS-managed 서비스, 온프렘, 타 클라우드 등
		// 1. 인터넷 -> 내부
		// 만약 내부 목적지 서브넷이 퍼블릭 -> 성공
		// 만약 내부 목적지 서브넷이 프라이빗 + LB 관리 -> 성공
		// 추가로 내부 목적지 서브넷 프라이빗 + 같은 VPC 내 퍼블릭 서브넷에 존재하는 EC2가 프록시 애플리케이션 수행 -> 성공
		// 추가로 엣지 서비스 경우, 온프렘, 타 클라우드 경우 고려
		// 2. 내부 -> 인터넷
		// 만약 내부 소스 서브넷이 퍼블릭 -> 성공
		// 만약 내부 소스 서브넷이 프라이빗 + NAT 게이트웨이 경유 -> 성공
		// 만약 내부 소스 서브넷이 프라이빗 + 다른 VPC의 NAT 게이트웨이 경유 -> 성공
		// 추가로 firewall 경유해서 NAT/IGW로 가는 경우, 같은 VPC 내 퍼블릭 서브넷에 존재하는 EC2가 프록시 애플리케이션 수행 -> 성공
		// 3. 내부 -> 내부
		// 만약 같은 VPC 내라면 -> 성공
		// 만약 다른 VPC 내라면 + VPC 간 경로 존재 -> 성공
	}
	private checkProblemConditions() {
		// 문제 조건들을 확인하는 로직
		// 문제에 명시된 조건들을 부합하는지 검사
		// 예: 특정 리소스가 존재하는지, 특정 설정이 적용되었는지, 리소스 제한을 준수하는지 등
	}
	private checkEndpointRules() {
		// 엔드포인트 규칙들을 확인하는 로직
		// 해당 작업에 대해 엔드포인트의 SG가 올바르게 설정되었는지 검사
		// 예: 특정 포트가 열려있는지, 특정 IP 대역에서 접근이 허용되는지 등
	}
	private generateFeedback() {
		// 피드백 생성 로직
		// 시나리오 실행 결과에 따라 적절한 피드백 메시지 생성
	}
}
