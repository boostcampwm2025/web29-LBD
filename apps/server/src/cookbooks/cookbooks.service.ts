import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cookbook } from 'src/entities/cookbook.entity';
import { CookbookDetailResponseDto } from './dto/cookbook-detail-response.dto';

@Injectable()
export class CookbooksService {
  constructor(
    @InjectRepository(Cookbook)
    private readonly cookbookRepository: Repository<Cookbook>,
  ) {}

  async findByCookbookId(
    cookbookId: number,
  ): Promise<CookbookDetailResponseDto> {
    const cookbook = await this.cookbookRepository.findOne({
      where: { id: cookbookId },
      relations: ['tags', 'cookbookProblems', 'cookbookProblems.problem'],
    });

    if (!cookbook) {
      throw new NotFoundException(`Cookbook with ID ${cookbookId} not found`);
    }

    return {
      id: cookbook.id,
      title: cookbook.title,
      description: cookbook.description,
      descDetail: cookbook.descDetail,
      tags: cookbook.tags.map((tag) => tag.name),
      problems: cookbook.cookbookProblems
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((cp) => ({
          id: cp.problem.id,
          title: cp.problem.title,
          orderNumber: cp.orderNumber,
        })),
    };
  }
}
