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

  @Column()
  courseId: string;

  @Column()
  userId: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  enrollmentDate: Date;

  @Column({ length: 20, default: 'enrolled' })
  status: string;

  @Column({ nullable: true })
  completionDate: Date;

  @Column({ default: false })
  certificateIssued: boolean;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, (user) => user.courseEnrollments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
