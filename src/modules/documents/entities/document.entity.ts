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

  @Column()
  serviceRequestId: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 255 })
  originalFilename: string;

  @Column({ length: 500 })
  filePath: string;

  @Column()
  fileSize: number;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ default: 1 })
  version: number;

  @ManyToOne(() => ServiceRequest, (request) => request.documents)
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest: ServiceRequest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
