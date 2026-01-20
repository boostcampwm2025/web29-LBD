export class BaseProblemItemDto {
  id: number;
  title: string;
  description: string;
  tags?: string[];
}

export class UnitProblemItemResponseDto extends BaseProblemItemDto {}

export class CookbookProblemItemResponseDto extends BaseProblemItemDto {
  problems: BaseProblemItemDto[];
}

// TODO: 시나리오 문제도 추가될 경우 여기에 추가
