import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Problem } from './problem.entity';

@Entity('solution')
export class Solution {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Problem, (problem) => problem.solution, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({ type: 'json' })
  answer_config: Record<string, any>;
}
