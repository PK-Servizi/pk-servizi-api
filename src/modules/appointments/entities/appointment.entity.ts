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
import { ServiceType } from '../../service-requests/entities/service-type.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ nullable: true, name: 'service_type_id' })
  serviceTypeId: string;

  @Column({ nullable: true, name: 'operator_id' })
  operatorId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'appointment_date' })
  appointmentDate: Date;

  @Column({ default: 60, name: 'duration_minutes' })
  durationMinutes: number;

  @Column({ length: 20, default: 'scheduled' })
  status: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.appointments)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  @ManyToOne(() => User, (user) => user.operatorAppointments)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
