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

  // Personal Information
  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  nationality: string;

  // Identity Documents
  @Column({ nullable: true, name: 'id_card_number' })
  idCardNumber: string;

  @Column({ type: 'date', nullable: true, name: 'id_card_expiry' })
  idCardExpiry: Date;

  @Column({ nullable: true, name: 'passport_number' })
  passportNumber: string;

  @Column({ type: 'date', nullable: true, name: 'passport_expiry' })
  passportExpiry: Date;

  // Employment & Financial
  @Column({ nullable: true, name: 'marital_status' })
  maritalStatus: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  employer: string;

  @Column({ type: 'numeric', nullable: true, name: 'monthly_income' })
  monthlyIncome: number;

  // Emergency Contact
  @Column({ nullable: true, name: 'emergency_contact_name' })
  emergencyContactName: string;

  @Column({ nullable: true, name: 'emergency_contact_phone' })
  emergencyContactPhone: string;

  @Column({ nullable: true, name: 'emergency_contact_relationship' })
  emergencyContactRelationship: string;

  // Preferences
  @Column({ name: 'preferred_language', default: 'it' })
  preferredLanguage: string;

  @Column({ name: 'preferred_communication', default: 'email' })
  preferredCommunication: string;

  @Column({ name: 'notifications_enabled', default: true })
  notificationsEnabled: boolean;

  @Column({ name: 'email_notifications', default: true })
  emailNotifications: boolean;

  @Column({ name: 'sms_notifications', default: false })
  smsNotifications: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
