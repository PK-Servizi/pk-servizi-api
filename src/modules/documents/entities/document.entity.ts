import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_request_id' })
  serviceRequestId: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 255, name: 'original_filename' })
  originalFilename: string;

  @Column({ length: 500, name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @Column({ length: 100, name: 'mime_type' })
  mimeType: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ default: false, name: 'is_required' })
  isRequired: boolean;

  @Column({ type: 'text', nullable: true, name: 'admin_notes' })
  adminNotes: string;

  @Column({ default: 1 })
  version: number;

  @ManyToOne(() => ServiceRequest, (request) => request.documents)
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest: ServiceRequest;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
