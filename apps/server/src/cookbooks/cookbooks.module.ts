import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookbooksController } from './cookbooks.controller';
import { CookbooksService } from './cookbooks.service';
import { Cookbook } from 'src/entities/cookbook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cookbook])],
  controllers: [CookbooksController],
  providers: [CookbooksService],
})
export class CookbooksModule {}
