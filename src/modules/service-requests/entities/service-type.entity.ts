import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('service_types')
export class ServiceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  requiredDocuments: any;

  @Column({ type: 'jsonb', nullable: true })
  formSchema: any;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ServiceRequest, (request) => request.serviceType)
  requests: ServiceRequest[];

  @OneToMany(() => Appointment, (appointment) => appointment.serviceType)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
