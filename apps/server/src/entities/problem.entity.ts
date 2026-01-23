import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Solution } from './solution.entity';
import { ProblemType } from '../problems/types/problem-type.enum';
import { Tag } from './tag.entity';
import { TServiceConfigMap } from '../constants/service-convention';

@Entity('problem')
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ProblemType })
  problem_type: ProblemType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: true })
  desc_detail: string;

  @Column({ type: 'json', nullable: false })
  required_fields: TServiceConfigMap[];

  @ManyToMany(() => Tag, (tag) => tag.problems)
  @JoinTable({
    name: 'problem_tag',
    joinColumn: { name: 'problem_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => Solution, (solution) => solution.problem, {
    cascade: true,
  })
  solution: Solution;

  @ManyToMany(() => Problem)
  @JoinTable({
    name: 'related_problem',
    joinColumn: { name: 'problem_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'related_problem_id',
      referencedColumnName: 'id',
    },
  })
  related_problems: Problem[];
}
