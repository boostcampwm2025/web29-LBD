export class CookbookDetailResponseDto {
  id: number;
  title: string;
  description: string;
  desc_detail: string;
  tags: string[];
  problems: Array<{
    id: number;
    title: string;
    order_number: number;
  }>;
}
