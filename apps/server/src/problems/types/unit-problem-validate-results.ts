export type UnitProblemValidateResultEntry = {
  onlyInAnswer: unknown[];
  onlyInSolution: unknown[];
};

export type UnitProblemValidateResult = {
  vpc?: UnitProblemValidateResultEntry;
  ec2?: UnitProblemValidateResultEntry;
  subnet?: UnitProblemValidateResultEntry;
};
