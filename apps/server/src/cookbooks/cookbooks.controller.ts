import { Controller, Get, HttpCode, Param, ParseIntPipe } from '@nestjs/common';
import { CookbooksService } from './cookbooks.service';

@Controller('cookbooks')
export class CookbooksController {
  constructor(private readonly cookbooksService: CookbooksService) {}

  @Get(':cookbookId')
  @HttpCode(200)
  findByCookbookId(@Param('cookbookId', ParseIntPipe) cookbookId: number) {
    return this.cookbooksService.findByCookbookId(cookbookId);
  }
}
