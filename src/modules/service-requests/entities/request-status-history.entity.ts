import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { User } from '../../users/entities/user.entity';

@Entity('request_status_history')
export class RequestStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceRequestId: string;

  @Column({ length: 20, nullable: true })
  fromStatus: string;

  @Column({ length: 20 })
  toStatus: string;

  @Column()
  changedById: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => ServiceRequest, (request) => request.statusHistory)
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest: ServiceRequest;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changed_by_id' })
  changedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
