import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CookbookProblem } from './cookbook-problem.entity';
import { Tag } from './tag.entity';

@Entity('cookbook')
export class Cookbook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.cookbooks)
  @JoinTable({
    name: 'cookbook_tag',
    joinColumn: { name: 'cookbook_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(
    () => CookbookProblem,
    (cookbookProblem) => cookbookProblem.cookbook,
    {
      cascade: true,
    },
  )
  cookbook_problems: CookbookProblem[];
}
