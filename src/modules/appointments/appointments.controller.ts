import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create appointment' })
  @Permissions('appointments.create')
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @Permissions('appointments.read')
  findAll() {
    return this.service.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get appointments by user' })
  @Permissions('appointments.read')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Get('operator/:operatorId')
  @ApiOperation({ summary: 'Get appointments by operator' })
  @Permissions('appointments.manage')
  findByOperator(@Param('operatorId') operatorId: string) {
    return this.service.findByOperator(operatorId);
  }

  @Get('available-slots/:operatorId')
  @ApiOperation({ summary: 'Get available time slots' })
  @Permissions('appointments.read')
  getAvailableSlots(
    @Param('operatorId') operatorId: string,
    @Query('date') date: string,
  ) {
    return this.service.getAvailableSlots(operatorId, new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @Permissions('appointments.read')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  @Permissions('appointments.update')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  @Permissions('appointments.update')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }
}
