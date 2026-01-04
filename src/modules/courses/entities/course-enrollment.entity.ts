import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from '../../users/entities/user.entity';

@Entity('course_enrollments')
@Unique(['courseId', 'userId'])
export class CourseEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id' })
  courseId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'enrollment_date' })
  enrollmentDate: Date;

  @Column({ length: 20, default: 'enrolled' })
  status: string;

  @Column({ nullable: true, name: 'completion_date' })
  completionDate: Date;

  @Column({ default: false, name: 'certificate_issued' })
  certificateIssued: boolean;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, (user) => user.courseEnrollments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
