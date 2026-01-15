export class CookbookDetailResponseDto {
  id: number;
  title: string;
  description: string;
  tags: string[];
  problems: Array<{
    id: number;
    title: string;
    order_number: number;
  }>;
}
