import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('cms_content')
export class CmsContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  type: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ length: 255, unique: true, nullable: true })
  slug: string;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ nullable: true })
  authorId: string;

  @Column({ nullable: true })
  publishedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
