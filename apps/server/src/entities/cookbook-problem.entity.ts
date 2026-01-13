import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Cookbook } from './cookbook.entity';
import { Problem } from './problem.entity';

@Entity('cookbook_problem')
export class CookProblem {
  @PrimaryColumn({ type: 'int' })
  cookbook_id: number;

  @PrimaryColumn({ type: 'int' })
  problem_id: number;

  @Column({ type: 'int' })
  order_number: number;

  @ManyToOne(() => Cookbook)
  @JoinColumn({ name: 'cookbook_id' })
  cookbook: Cookbook;

  @ManyToOne(() => Problem)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;
}
