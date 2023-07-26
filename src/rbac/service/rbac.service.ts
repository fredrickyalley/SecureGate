import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Permission, User } from '@prisma/client';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import {
  AssignRoleToUserDto,
  RevokeRoleOfUserDto,
} from '../dto/assign-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * PERMISSIONS SERVICE
   * @returns
   */

  async getPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({ where: { deletedAt: null } });
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    const { name } = createPermissionDto;
    const permission = await this.prisma.permission.findFirst({
      where: { name, deletedAt: null },
    });
    if (permission) throw new HttpException('Permission already exists', 400);

    return this.prisma.permission.create({ data: { name } });
  }

  async getPermissionById(id: number): Promise<Permission> {
    const permission = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
    });
    if (!permission) throw new NotFoundException(`Permission ${id} not found`);
    return permission;
  }

  async updatePermission(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
    });
    if (!permission) throw new NotFoundException(`Permission ${id} not found`);

    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  /**
   * ROLES SERVICES
   * @returns
   */

  async getRoles(): Promise<Role[]> {
    return this.prisma.role.findMany({ where: { deletedAt: null } });
  }

  async getRoleById(roleId: number): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, deletedAt: null },
    });

    if (!role) throw new NotFoundException(`Role ${roleId} not found`);

    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, permissionId } = createRoleDto;

    if (permissionId) {
      const role = await this.prisma.role.findFirst({
        where: { name, deletedAt: null },
      });
      if (role) throw new HttpException('Role already exists', 400);

      return await this.prisma.role.create({
        data: {
          name,
          permissions: {
            connect: {
              id: permissionId,
            },
          },
        },
      });
    } else {
      const role = await this.prisma.role.findFirst({
        where: { name, deletedAt: null },
      });
      if (role) throw new HttpException('Role already exists', 400);

      return await this.prisma.role.create({ data: { name } });
    }
  }

  async updateRole(
    roleId: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const { name, permissionId } = updateRoleDto;

    if (permissionId) {
      const role = await this.prisma.role.findFirst({
        where: { id: roleId, deletedAt: null },
        select: { permissions: true },
      });
      if (!role) throw new NotFoundException('Role does not exist');

      const permission = await this.prisma.permission.findFirst({
        where: { id: permissionId, deletedAt: null },
      });
      if (!permission) throw new NotFoundException('Permission does not exist');

      for (const permission of role.permissions) {
        if (permission.id === permissionId)
          throw new HttpException('Permission already already exists', 400);
      }
      return await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            connect: {
              id: permissionId,
            },
          },
        },
      });
    } else {
      if (name === '') throw new HttpException('Name must not be empty', 400);

      const role = await this.prisma.role.findFirst({
        where: { id: roleId, deletedAt: null },
        select: { permissions: true },
      });
      if (!role) throw new NotFoundException('Role does not exist');

      return await this.prisma.role.update({
        where: { id: roleId },
        data: {
          name,
        },
      });
    }
  }

  async deleteRole(roleId: number): Promise<void> {
    const role = await this.prisma.role.findFirst({ where: { id: roleId } });

    if (!role || role.deletedAt === null)
      throw new NotFoundException(`Role ${roleId} not found`);

    if (role.deletedAt === null) {
      await this.prisma.role.update({
        where: { id: roleId },
        data: { deletedAt: new Date() },
      });
    } else {
      throw new HttpException('Role already deleted', 400);
    }
  }

  async assignRoleToUser(assignRoleToUser: AssignRoleToUserDto): Promise<void> {
    const { userId, roleId } = assignRoleToUser;

    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.role.findUnique({
      where: { id: roleId, deletedAt: null },
    });

    if (!role) throw new NotFoundException('Role not found');

    const userRole = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
        roles: {
          some: {
            id: roleId,
          },
        },
      },
    });

    if (userRole) throw new HttpException('User already has this role', 400);

    await this.prisma.role.update({
      where: { id: roleId },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async revokeRoleOfUser(revokeRoleOfUser: RevokeRoleOfUserDto): Promise<void> {
    const { userId, roleId } = revokeRoleOfUser;

    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.role.findUnique({ where: { id: roleId } });

    if (!role) throw new NotFoundException('Role not found');

    if (role.deletedAt === null) {
      await this.prisma.role.update({
        where: {
          id: roleId,
        },
        data: { deletedAt: new Date(Date.now()) },
      });
    } else {
      throw new HttpException('User role has already been revoked', 400);
    }
  }

  async reassignRoleOfUser(
    assignRoleToUserDto: AssignRoleToUserDto,
  ): Promise<void> {
    const { userId, roleId } = assignRoleToUserDto;
    const userRole = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!userRole) throw new NotFoundException('User role does not exist');

    if (userRole.deletedAt !== null) {
      await this.prisma.role.update({
        where: {
          id: roleId,
        },
        data: { deletedAt: null },
      });
    } else {
      throw new HttpException('User role has already been assigned', 400);
    }
  }

  async getPermissionsForUser(userId: number): Promise<Permission[]> {
    const userWithRoles = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { roles: { include: { permissions: true } } },
    });

    const allPermissions: Permission[] = [];
    const roles = userWithRoles.roles;

    roles.forEach((role) => {
      role.permissions.forEach((element) => {
        if (element.deletedAt === null) allPermissions.push(element);
      });
    });

    if (allPermissions.length === 0) return [];

    return allPermissions;
  }

  async hasRoles(userId: any, requiredRoles: string[]): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { roles: true },
    });
    if (user.roles.length === 0) {
      return false;
    }

    for (const role of user.roles) {
      const roles = await this.prisma.role.findFirst({
        where: { id: role.id, deletedAt: null },
      });
      if (requiredRoles.includes(roles.name)) {
        return true;
      }
    }

    return false;
  }

  async hasPermission(
    userId: number,
    requiredPermissions: string[],
  ): Promise<boolean> {
    const permissions = await this.getPermissionsForUser(userId);
    for (const permission of permissions) {
      if (requiredPermissions.includes(permission.name)) {
        return true;
      }
    }

    return false;
  }
}
