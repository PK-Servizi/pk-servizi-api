import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/services/base.service';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * RolesService
 * Manages role CRUD operations and permissions assignment
 * Extends BaseService to reduce redundant find/create/update/delete logic
 */
export class RolesService extends BaseService<
  Role,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(
    @InjectRepository(Role)
    protected readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {
    super(roleRepository);
  }

  /**
   * Create role with unique name validation
   */
  async create(dto: CreateRoleDto) {
    const existing = await this.roleRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Role name already exists');
    }

    return super.create(dto);
  }

  /**
   * Find all roles (wrapper for BaseService)
   */
  async findAll() {
    return super.findAll();
  }

  /**
   * Find role by ID with permissions
   */
  async findRoleWithPermissions(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Transform the response to include flat permissions array
    const permissions = role.rolePermissions?.map((rp) => rp.permission) || [];

    // Create a plain object response
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: JSON.parse(role.permissions || '[]'),
      permissionsDetailed: permissions,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  /**
   * Remove role (wrapper for BaseService)
   */
  async remove(id: string) {
    return super.delete(id);
  }

  /**
   * Update role with unique name validation
   */
  async update(id: string, dto: UpdateRoleDto) {
    // Verify role exists using inherited method
    await this.findById(id);

    if (dto.name) {
      const existing = await this.roleRepository.findOne({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Role name already exists');
      }
    }

    return super.update(id, dto);
  }

  /**
   * Find role by name
   */
  async findByName(name: string) {
    return this.roleRepository.findOne({ where: { name } });
  }

  /**
   * Get all permissions
   */
  async findAllPermissions() {
    const permissions = await this.permissionRepository.find({
      order: { name: 'ASC' },
    });
    return permissions;
  }

  /**
   * Assign permissions to role
   */
  async assignPermissions(id: string, dto: any) {
    // Verify role exists
    await this.findById(id);

    // Verify permissions exist
    const permissions = await this.permissionRepository.findByIds(
      dto.permissionIds,
    );
    if (permissions.length !== dto.permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // Assign permissions
    const rolePermissions = [];
    for (const permission of permissions) {
      // Check if already assigned
      const existing = await this.rolePermissionRepository.findOne({
        where: {
          roleId: id,
          permissionId: permission.id,
        },
      });

      if (!existing) {
        const rolePermission = this.rolePermissionRepository.create({
          roleId: id,
          permissionId: permission.id,
        });
        rolePermissions.push(
          await this.rolePermissionRepository.save(rolePermission),
        );
      }
    }

    return {
      success: true,
      message: 'Permissions assigned successfully',
      data: rolePermissions,
    };
  }

  /**
   * Remove permission from role
   */
  async removePermission(roleId: string, permissionId: string) {
    // Verify role exists
    await this.findById(roleId);

    // Verify permission exists
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // Remove permission
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        roleId,
        permissionId,
      },
    });

    if (rolePermission) {
      await this.rolePermissionRepository.remove(rolePermission);
    }

    return {
      success: true,
      message: 'Permission removed successfully',
    };
  }

  /**
   * Assign role to user
   */
  async assignRoleToUser(userId: string, dto: any) {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: dto.roleId },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${dto.roleId} not found`);
    }

    // Assign role
    user.role = role;
    const savedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _password, ...result } = savedUser;
    return result;
  }

  /**
   * Assign permission to user
   */
  async assignPermissionToUser(id: string, _dto: any) {
    // Verify role exists
    await this.findById(id);
    // TODO: Implement user permission assignment
    return null;
  }
}
