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

  @Column({ name: 'problem_type', type: 'enum', enum: ProblemType })
  problemType: ProblemType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ name: 'desc_detail', type: 'text', nullable: true })
  descDetail: string;

  @Column({ name: 'required_fields', type: 'json', nullable: false })
  requiredFields: TServiceConfigMap[];

  @ManyToMany(() => Tag, (tag) => tag.problems)
  @JoinTable({
    name: 'problem_tag',
    joinColumn: { name: 'problem_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

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
  relatedProblems: Problem[];
}
