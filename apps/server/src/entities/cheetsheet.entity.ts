import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cheetsheet')
export class Cheetsheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;
}
