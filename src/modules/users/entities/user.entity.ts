import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { UserPermission } from './user-permission.entity';
import { UserSubscription } from '../../subscriptions/entities/user-subscription.entity';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Course } from '../../courses/entities/course.entity';
import { CourseEnrollment } from '../../courses/entities/course-enrollment.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ length: 16, nullable: true, name: 'fiscal_code' })
  fiscalCode: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 10, nullable: true, name: 'postal_code' })
  postalCode: string;

  @Column({ length: 2, nullable: true })
  province: string;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate: Date;

  @Column({ length: 100, nullable: true, name: 'birth_place' })
  birthPlace: string;

  @Column({ default: false, name: 'gdpr_consent' })
  gdprConsent: boolean;

  @Column({ nullable: true, name: 'gdpr_consent_date' })
  gdprConsentDate: Date;

  @Column({ default: false, name: 'privacy_consent' })
  privacyConsent: boolean;

  @Column({ nullable: true, name: 'privacy_consent_date' })
  privacyConsentDate: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'role_id', nullable: true })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermissions: UserPermission[];

  @ManyToMany(() => Permission, (permission) => permission.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @OneToMany(() => UserSubscription, (subscription) => subscription.user)
  subscriptions: UserSubscription[];

  @OneToMany(() => ServiceRequest, (request) => request.user)
  serviceRequests: ServiceRequest[];

  @OneToMany(() => ServiceRequest, (request) => request.assignedOperator)
  assignedRequests: ServiceRequest[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.operator)
  operatorAppointments: Appointment[];

  @OneToMany(() => Course, (course) => course.instructor)
  instructedCourses: Course[];

  @OneToMany(() => CourseEnrollment, (enrollment) => enrollment.user)
  courseEnrollments: CourseEnrollment[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
