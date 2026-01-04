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

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'service_type_id' })
  serviceTypeId: string;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ type: 'jsonb', nullable: true, name: 'form_data' })
  formData: any;

  @Column({ type: 'text', nullable: true, name: 'internal_notes' })
  internalNotes: string;

  @Column({ type: 'text', nullable: true, name: 'user_notes' })
  userNotes: string;

  @Column({ nullable: true, name: 'assigned_operator_id' })
  assignedOperatorId: string;

  @Column({ length: 10, default: 'normal' })
  priority: string;

  @Column({ nullable: true, name: 'submitted_at' })
  submittedAt: Date;

  @Column({ nullable: true, name: 'completed_at' })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
