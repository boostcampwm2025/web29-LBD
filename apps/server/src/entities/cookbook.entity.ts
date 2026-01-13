import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CookbookProblem } from './cookbook-problem.entity';

@Entity('cookbook')
export class Cookbook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  tags: string[];

  @OneToMany(
    () => CookbookProblem,
    (cookbookProblem) => cookbookProblem.cookbook,
    {
      cascade: true,
    },
  )
  cookbook_problems: CookbookProblem[];
}
