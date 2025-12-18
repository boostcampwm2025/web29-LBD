import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('solution')
export class Solution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  config_type: string;

  @Column({ type: 'json' })
  config_info: object;
}
