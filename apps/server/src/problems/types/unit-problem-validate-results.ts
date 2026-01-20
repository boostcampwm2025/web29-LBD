import { ServiceConfigTypes } from './service-config-type.enum';

export type UnitProblemValidateResultEntry = {
  onlyInAnswer: ServiceConfigTypes[];
  onlyInSolution: ServiceConfigTypes[];
};

export type UnitProblemValidateResult = {
  vpc?: UnitProblemValidateResultEntry;
  ec2?: UnitProblemValidateResultEntry;
  subnet?: UnitProblemValidateResultEntry;
  routeTable?: UnitProblemValidateResultEntry;
  securityGroups?: UnitProblemValidateResultEntry;
  s3?: UnitProblemValidateResultEntry;
  internetGateway?: UnitProblemValidateResultEntry;
};
