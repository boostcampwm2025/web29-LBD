import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Cookbook } from './cookbook.entity';
import { Problem } from './problem.entity';

@Entity('cookbook_problem')
export class CookbookProblem {
  @PrimaryColumn({ name: 'cookbook_id', type: 'int' })
  cookbookId: number;

  @PrimaryColumn({ name: 'problem_id', type: 'int' })
  problemId: number;

  @Column({ name: 'order_number', type: 'int' })
  orderNumber: number;

  @ManyToOne(() => Cookbook, (cookbook) => cookbook.cookbookProblems, {
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
