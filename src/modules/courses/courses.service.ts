import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseEnrollment } from './entities/course-enrollment.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseEnrollment)
    private enrollmentRepository: Repository<CourseEnrollment>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findAllCourses(page = 1, limit = 10) {
    const [data, total] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { startDate: 'ASC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findActiveCourses() {
    return this.courseRepository.find({
      where: { status: 'published' },
      order: { startDate: 'ASC' },
    });
  }

  async findCourse(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['enrollments', 'enrollments.user'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    await this.courseRepository.update(id, updateCourseDto);
    return this.findCourse(id);
  }

  async deleteCourse(id: string): Promise<void> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }

  async enrollUser(
    createEnrollmentDto: CreateCourseEnrollmentDto,
  ): Promise<CourseEnrollment> {
    const { courseId, userId } = createEnrollmentDto;
    const course = await this.courseRepository.findOne({
      where: { id: courseId, status: 'published' },
    });

    if (!course) {
      throw new NotFoundException('Course not found or inactive');
    }
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { courseId, userId },
    });

    if (existingEnrollment) {
      throw new BadRequestException('User already enrolled in this course');
    }
    const enrollmentCount = await this.enrollmentRepository.count({
      where: { courseId },
    });

    if (course.maxParticipants && enrollmentCount >= course.maxParticipants) {
      throw new BadRequestException('Course is full');
    }

    const enrollment = this.enrollmentRepository.create(createEnrollmentDto);
    return this.enrollmentRepository.save(enrollment);
  }

  async getUserEnrollments(userId: string) {
    return this.enrollmentRepository.find({
      where: { userId },
      relations: ['course'],
      order: { enrollmentDate: 'DESC' },
    });
  }

  async getCourseEnrollments(courseId: string) {
    return this.enrollmentRepository.find({
      where: { courseId },
      relations: ['user'],
      order: { enrollmentDate: 'ASC' },
    });
  }

  async updateEnrollmentStatus(
    enrollmentId: string,
    status: string,
  ): Promise<CourseEnrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    enrollment.status = status;
    return this.enrollmentRepository.save(enrollment);
  }
}
