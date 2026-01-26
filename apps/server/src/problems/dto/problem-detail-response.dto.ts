import { ProblemType } from '../types/problem-type.enum';
import { TServiceConfigMap } from '../../constants/service-convention';

export class ProblemDetailResponseDto {
  id: number;
  problemType: ProblemType;
  title: string;
  description: string;
  descDetail: string;
  requiredFields: TServiceConfigMap[];
  tags: string[];
}
