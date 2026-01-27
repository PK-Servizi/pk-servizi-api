import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { ServiceType } from '../../service-types/entities/service-type.entity';

@Entity('services')
@Index(['isActive'])
@Index(['serviceTypeId'])
@Index(['isActive', 'serviceTypeId'])
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'base_price',
  })
  basePrice: number;

  @Column({ type: 'jsonb', nullable: true, name: 'required_documents' })
  requiredDocuments: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'document_requirements' })
  documentRequirements: any;

  @Column({ type: 'jsonb', nullable: true, name: 'form_schema' })
  formSchema: any;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Relation to ServiceType
  @Column({ name: 'service_type_id', nullable: true })
  serviceTypeId: string;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.services)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  @OneToMany(() => ServiceRequest, (request) => request.service)
  requests: ServiceRequest[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
