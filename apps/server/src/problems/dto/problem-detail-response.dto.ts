import { ProblemType } from '../types/problem-type.enum';
import { TServiceConfigMap } from '../../constants/service-convention';

export class ProblemDetailResponseDto {
  id: number;
  problem_type: ProblemType;
  title: string;
  description: string;
  required_fields: TServiceConfigMap[];
  tags: string[];
}
