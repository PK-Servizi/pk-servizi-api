import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointmentDate = new Date(dto.appointmentDate);
    const conflict = await this.checkConflict(
      appointmentDate,
      dto.durationMinutes || 60,
      dto.operatorId,
    );
    if (conflict) {
      throw new BadRequestException('Appointment slot is not available');
    }

    const appointment = this.appointmentRepository.create({
      ...dto,
      appointmentDate,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['user', 'serviceType', 'operator'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findByUser(userId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { userId },
      relations: ['serviceType', 'operator'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async findByOperator(operatorId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { operatorId },
      relations: ['user', 'serviceType'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
      relations: ['user', 'serviceType', 'operator'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'serviceType', 'operator'],
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (dto.appointmentDate) {
      const newDate = new Date(dto.appointmentDate);
      const duration = dto.durationMinutes || appointment.durationMinutes;
      const operatorId = dto.operatorId || appointment.operatorId;

      const conflict = await this.checkConflict(
        newDate,
        duration,
        operatorId,
        id,
      );
      if (conflict) {
        throw new BadRequestException('New appointment slot is not available');
      }
    }

    const updateData = {
      ...dto,
      appointmentDate: dto.appointmentDate
        ? new Date(dto.appointmentDate)
        : undefined,
    };

    await this.appointmentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async cancel(id: string): Promise<Appointment> {
    await this.findOne(id);
    await this.appointmentRepository.update(id, { status: 'cancelled' });
    return this.findOne(id);
  }

  async getAvailableSlots(operatorId: string, date: Date): Promise<string[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0); // 9 AM

    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0); // 5 PM

    const existingAppointments = await this.appointmentRepository.find({
      where: {
        operatorId,
        appointmentDate: Between(startOfDay, endOfDay),
        status: 'scheduled',
      },
    });

    const slots: string[] = [];
    const current = new Date(startOfDay);

    while (current < endOfDay) {
      const slotTime = current.toTimeString().slice(0, 5);
      const isOccupied = existingAppointments.some((apt) => {
        const aptTime = apt.appointmentDate.toTimeString().slice(0, 5);
        return aptTime === slotTime;
      });

      if (!isOccupied) {
        slots.push(slotTime);
      }

      current.setMinutes(current.getMinutes() + 60); // 1-hour slots
    }

    return slots;
  }

  private async checkConflict(
    appointmentDate: Date,
    duration: number,
    operatorId?: string,
    excludeId?: string,
  ): Promise<boolean> {
    if (!operatorId) return false;

    const endTime = new Date(appointmentDate.getTime() + duration * 60000);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.operatorId = :operatorId', { operatorId })
      .andWhere('appointment.status != :status', { status: 'cancelled' })
      .andWhere(
        '(appointment.appointmentDate < :endTime AND DATE_ADD(appointment.appointmentDate, INTERVAL appointment.durationMinutes MINUTE) > :startTime)',
        { startTime: appointmentDate, endTime },
      );

    if (excludeId) {
      queryBuilder.andWhere('appointment.id != :excludeId', { excludeId });
    }

    const conflicting = await queryBuilder.getOne();
    return !!conflicting;
  }
}
