import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ServiceType } from './service-type.entity';
import { Document } from '../../documents/entities/document.entity';
import { RequestStatusHistory } from './request-status-history.entity';

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  serviceTypeId: string;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  formData: any;

  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  @Column({ type: 'text', nullable: true })
  userNotes: string;

  @Column({ nullable: true })
  assignedOperatorId: string;

  @Column({ length: 10, default: 'normal' })
  priority: string;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne(() => User, (user) => user.serviceRequests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.requests)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  @ManyToOne(() => User, (user) => user.assignedRequests)
  @JoinColumn({ name: 'assigned_operator_id' })
  assignedOperator: User;

  @OneToMany(() => Document, (document) => document.serviceRequest)
  documents: Document[];

  @OneToMany(() => RequestStatusHistory, (history) => history.serviceRequest)
  statusHistory: RequestStatusHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
