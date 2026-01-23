import { Injectable } from '@nestjs/common';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { FeedbackDto } from '@/problems/dto/submit-response.dto';
import { SgRequirements } from '@/problems/types/requirements-types';
import { SGFeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';

@Injectable()
export class SgScenarioHandler {
  validate(
    submitConfig: SubmitConfig,
    requirements: SgRequirements | undefined,
  ): FeedbackDto[] {
    if (!requirements) return [];
    const feedbacks: FeedbackDto[] = [];

    // 1. Security Group 규칙 검증
    if (requirements.securityGroup) {
      feedbacks.push(
        ...this.validateSgRules(submitConfig, requirements.securityGroup),
      );
    }

    // 2. EC2 Attachment 검증
    if (requirements.ec2Attachment) {
      feedbacks.push(
        ...this.validateEc2Attachment(submitConfig, requirements.ec2Attachment),
      );
    }

    return feedbacks;
  }

  private validateSgRules(
    config: SubmitConfig,
    reqs: SgRequirements['securityGroup'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const sgs = config.securityGroups || [];

    for (const [sgName, req] of Object.entries(reqs ?? {})) {
      const sg = sgs.find((s) => s.name === sgName);
      if (!sg) continue;

      const rules = sg.ipPermissions || [];

      // 1. SG_INBOUND_PORT_CLOSED
      if (req.requireOpenPorts) {
        for (const reqPort of req.requireOpenPorts) {
          // 해당 포트를 포함하는 'Inbound' 규칙이 있는지 확인
          const isOpen = rules.some((r) => {
            if (!r.isInbound) return false;

            const proto = r.ipProtocol;
            // Protocol '-1', All 이면 통과
            if (proto === '-1') return true;

            const from = parseInt(r.fromPort, 10);
            const to = parseInt(r.toPort, 10);
            return from <= reqPort && to >= reqPort;
          });

          if (!isOpen) {
            feedbacks.push({
              serviceType: 'securityGroup',
              service: sgName,
              field: 'ipPermissions',
              code: SGFeedbackScenarios.SG_INBOUND_PORT_CLOSED,
              message: `보안 그룹 ${sgName}에 필수 포트(${reqPort})에 대한 인바운드 허용 규칙이 없습니다.`,
            });
          }
        }
      }

      // 2. SG_SSH_OPEN_TO_WORLD
      if (req.checkSshOpenToWorld) {
        const isSshOpen = rules.some((r) => {
          if (!r.isInbound) return false;

          const proto = r.ipProtocol;
          const from = parseInt(r.fromPort, 10);
          const to = parseInt(r.toPort, 10);

          // SSH 포트(22)를 포함하는지
          const coversSsh = proto === '-1' || (from <= 22 && to >= 22);
          // 0.0.0.0/0 인지
          const isAnywhere = r.cidrIp === '0.0.0.0/0';

          return coversSsh && isAnywhere;
        });

        if (isSshOpen) {
          feedbacks.push({
            serviceType: 'securityGroup',
            service: sgName,
            field: 'ipPermissions',
            code: SGFeedbackScenarios.SG_SSH_OPEN_TO_WORLD,
            message: `보안 그룹 ${sgName}의 SSH(22) 포트가 모든 IP(0.0.0.0/0)에 개방되어 있습니다. 보안 위험이 있습니다.`,
          });
        }
      }

      // 3. SG_WRONG_SOURCE
      if (req.requireSource) {
        for (const condition of req.requireSource) {
          const { port, source } = condition;

          // 해당 포트를 커버하는 Inbound 규칙 찾기
          const matchingRule = rules.find((r) => {
            if (!r.isInbound) return false;

            const proto = r.ipProtocol;
            if (proto === '-1') return true;

            const from = parseInt(r.fromPort, 10);
            const to = parseInt(r.toPort, 10);
            return from <= port && to >= port;
          });

          if (!matchingRule) {
            // 포트가 닫혀있는 경우는 위에서 처리하므로 여기선 패스
            continue;
          }

          if (matchingRule.cidrIp !== source) {
            feedbacks.push({
              serviceType: 'securityGroup',
              service: sgName,
              field: 'ipPermissions',
              code: SGFeedbackScenarios.SG_WRONG_SOURCE,
              message: `보안 그룹 ${sgName}의 포트 ${port}에 대한 소스 설정이 올바르지 않습니다. (현재: ${matchingRule.cidrIp}, 요구: ${source})`,
            });
          }
        }
      }
    }
    return feedbacks;
  }

  private validateEc2Attachment(
    config: SubmitConfig,
    reqs: SgRequirements['ec2Attachment'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const ec2s = config.ec2 || [];

    for (const [ec2Name, req] of Object.entries(reqs ?? {})) {
      const ec2 = ec2s.find((i) => i.name === ec2Name);
      if (!ec2) continue;

      const attachedSgs = ec2.securityGroups || [];

      if (req.requireSecurityGroups) {
        const missingSgs = req.requireSecurityGroups.filter(
          (reqSg) => !attachedSgs.includes(reqSg),
        );

        if (missingSgs.length > 0) {
          feedbacks.push({
            serviceType: 'ec2',
            service: ec2Name,
            field: 'securityGroups',
            code: SGFeedbackScenarios.EC2_WRONG_SG_ATTACHED,
            message: `EC2 인스턴스 ${ec2Name}에 올바른 보안 그룹이 연결되지 않았습니다. 누락된 그룹: ${missingSgs.join(', ')}`,
          });
        }
      }
    }
    return feedbacks;
  }
}
