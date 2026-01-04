import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CourseEnrollment } from './course-enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true, name: 'instructor_id' })
  instructorId: string;

  @Column({ nullable: true, name: 'max_participants' })
  maxParticipants: number;

  @Column({ nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @ManyToOne(() => User, (user) => user.instructedCourses)
  @JoinColumn({ name: 'instructor_id' })
  instructor: User;

  @OneToMany(() => CourseEnrollment, (enrollment) => enrollment.course)
  enrollments: CourseEnrollment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
