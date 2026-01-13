import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
