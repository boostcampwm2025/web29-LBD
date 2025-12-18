import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Cheetsheet } from './cheetsheet.entity';
import { Problem } from './problem.entity';

@Entity('cheetsheet_problem')
export class CheetsheetProblem {
  @PrimaryColumn({ type: 'int' })
  cheetsheet_id: number;

  @PrimaryColumn({ type: 'int' })
  problem_id: number;

  @Column({ type: 'int' })
  problem_number: number;

  @ManyToOne(() => Cheetsheet)
  @JoinColumn({ name: 'cheetsheet_id' })
  cheetsheet: Cheetsheet;

  @ManyToOne(() => Problem)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;
}
