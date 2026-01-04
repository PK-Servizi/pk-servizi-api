import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ length: 20, nullable: true })
  gender: string;

  @Column({ length: 100, nullable: true })
  nationality: string;

  @Column({ length: 50, nullable: true, name: 'id_card_number' })
  idCardNumber: string;

  @Column({ type: 'date', nullable: true, name: 'id_card_expiry' })
  idCardExpiry: Date;

  @Column({ length: 50, nullable: true, name: 'passport_number' })
  passportNumber: string;

  @Column({ type: 'date', nullable: true, name: 'passport_expiry' })
  passportExpiry: Date;

  @Column({ length: 20, nullable: true, name: 'marital_status' })
  maritalStatus: string;

  @Column({ length: 100, nullable: true })
  occupation: string;

  @Column({ length: 200, nullable: true })
  employer: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'monthly_income' })
  monthlyIncome: number;

  @Column({ length: 255, nullable: true, name: 'emergency_contact_name' })
  emergencyContactName: string;

  @Column({ length: 20, nullable: true, name: 'emergency_contact_phone' })
  emergencyContactPhone: string;

  @Column({ length: 50, nullable: true, name: 'emergency_contact_relationship' })
  emergencyContactRelationship: string;

  @Column({ length: 10, default: 'it', name: 'preferred_language' })
  preferredLanguage: string;

  @Column({ length: 20, default: 'email', name: 'preferred_communication' })
  preferredCommunication: string;

  @Column({ default: true, name: 'notifications_enabled' })
  notificationsEnabled: boolean;

  @Column({ default: true, name: 'email_notifications' })
  emailNotifications: boolean;

  @Column({ default: false, name: 'sms_notifications' })
  smsNotifications: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}