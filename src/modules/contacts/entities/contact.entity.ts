import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ContactStatus = 'new' | 'read' | 'replied';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Index()
  @Column({ length: 255 })
  email: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 300 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Index()
  @Column({ length: 20, default: 'new' })
  status: ContactStatus;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
