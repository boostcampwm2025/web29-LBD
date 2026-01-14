import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Problem } from './problem.entity';
import { Cookbook } from './cookbook.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;

  @ManyToMany(() => Problem, (problem) => problem.tags)
  problems: Problem[];

  @ManyToMany(() => Cookbook, (cookbook) => cookbook.tags)
  cookbooks: Cookbook[];
}
