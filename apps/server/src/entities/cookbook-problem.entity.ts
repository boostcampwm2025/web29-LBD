import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Cookbook } from './cookbook.entity';
import { Problem } from './problem.entity';

@Entity('cookbook_problem')
export class CookbookProblem {
  @PrimaryColumn({ type: 'int' })
  cookbook_id: number;

  @PrimaryColumn({ type: 'int' })
  problem_id: number;

  @Column({ type: 'int' })
  order_number: number;

  @ManyToOne(() => Cookbook, (cookbook) => cookbook.cookbook_problems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cookbook_id' })
  cookbook: Cookbook;

  @ManyToOne(() => Problem, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;
}
