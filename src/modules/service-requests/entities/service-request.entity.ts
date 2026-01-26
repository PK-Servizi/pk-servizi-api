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
import { Service } from '../../services/entities/service.entity';
import { Document } from '../../documents/entities/document.entity';
import { RequestStatusHistory } from './request-status-history.entity';

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'service_id' })
  serviceId: string;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ nullable: true, name: 'payment_id' })
  paymentId: string;

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

  @Column({ nullable: true, name: 'form_completed_at' })
  formCompletedAt: Date;

  @Column({ nullable: true, name: 'documents_uploaded_at' })
  documentsUploadedAt: Date;

  @ManyToOne(() => User, (user) => user.serviceRequests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Service, (service) => service.requests)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => User, (user) => user.assignedRequests)
  @JoinColumn({ name: 'assigned_operator_id' })
  assignedOperator: User;

  @ManyToOne('Payment', 'serviceRequest')
  @JoinColumn({ name: 'payment_id' })
  payment: any;

  @OneToMany(() => Document, (document) => document.serviceRequest)
  documents: Document[];

  @OneToMany(() => RequestStatusHistory, (history) => history.serviceRequest)
  statusHistory: RequestStatusHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
