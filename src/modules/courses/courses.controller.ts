import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create course' })
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllCourses(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.coursesService.findAllCourses(page, limit);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active courses' })
  findActiveCourses() {
    return this.coursesService.findActiveCourses();
  }

  @Get('my-enrollments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user enrollments' })
  getMyEnrollments(@CurrentUser() user: any) {
    return this.coursesService.getUserEnrollments(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  findCourse(@Param('id') id: string) {
    return this.coursesService.findCourse(id);
  }

  @Get(':id/enrollments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course enrollments' })
  getCourseEnrollments(@Param('id') id: string) {
    return this.coursesService.getCourseEnrollments(id);
  }

  @Post('enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in course' })
  enrollUser(@Body() createEnrollmentDto: CreateCourseEnrollmentDto) {
    return this.coursesService.enrollUser(createEnrollmentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course' })
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Patch('enrollment/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enrollment status' })
  updateEnrollmentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.coursesService.updateEnrollmentStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete course' })
  deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
