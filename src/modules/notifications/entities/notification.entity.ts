import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ length: 50, default: 'info' })
  type: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ length: 500, nullable: true })
  actionUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  readAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
