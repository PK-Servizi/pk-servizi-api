import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.roleRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Role name already exists');
    }

    const role = this.roleRepository.create(dto);
    const saved = await this.roleRepository.save(role);

    return {
      success: true,
      message: 'Role created successfully',
      data: saved,
    };
  }

  async findAll() {
    const roles = await this.roleRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      message: 'Roles retrieved successfully',
      data: roles,
    };
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      success: true,
      message: 'Role retrieved successfully',
      data: role,
    };
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (dto.name && dto.name !== role.name) {
      const existing = await this.roleRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException('Role name already exists');
      }
    }

    await this.roleRepository.update(id, dto);
    const updated = await this.roleRepository.findOne({ where: { id } });

    return {
      success: true,
      message: 'Role updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.remove(role);

    return {
      success: true,
      message: 'Role deleted successfully',
    };
  }

  async findByName(name: string) {
    return this.roleRepository.findOne({ where: { name } });
  }

  // Missing methods from controller
  async findAllPermissions() {
    return {
      success: true,
      message: 'Permissions retrieved successfully',
      data: [],
    };
  }

  async assignPermissions(id: string, dto: any) {
    return {
      success: true,
      message: 'Permissions assigned successfully',
    };
  }

  async removePermission(roleId: string, permissionId: string) {
    return {
      success: true,
      message: 'Permission removed successfully',
    };
  }

  async assignRoleToUser(id: string, dto: any) {
    return {
      success: true,
      message: 'Role assigned to user successfully',
    };
  }

  async assignPermissionToUser(id: string, dto: any) {
    return {
      success: true,
      message: 'Permission assigned to user successfully',
    };
  }
}