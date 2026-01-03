import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 50 })
  resourceType: string;

  @Column({ type: 'uuid', nullable: true })
  resourceId: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValues: any;

  @Column({ type: 'jsonb', nullable: true })
  newValues: any;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
