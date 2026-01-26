export class CookbookDetailResponseDto {
  id: number;
  title: string;
  description: string;
  descDetail: string;
  tags: string[];
  problems: Array<{
    id: number;
    title: string;
    orderNumber: number;
  }>;
}
