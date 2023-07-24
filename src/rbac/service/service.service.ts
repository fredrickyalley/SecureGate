import { Injectable } from '@nestjs/common';
import { Role, RoleUser, Permission, User } from '@prisma/client';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async getRoleById(roleId: number): Promise<Role | null> {
    return this.prisma.role.findUnique({ where: { id: roleId } });
  }

  async getPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  async createRole(name: string): Promise<Role> {
    return this.prisma.role.create({ data: { name } });
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<RoleUser> {
    return this.prisma.roleUser.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async revokeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.prisma.roleUser.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  async getPermissionsForUser(userId: number): Promise<Permission[]> {
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: { select: {permissions: true}}} } },
    });

    if (!userWithRoles) {
      return [];
    }

    const allPermissions: Permission[] = [];
    const roles =  userWithRoles.roles['role'];
    roles.forEach((role) => {
      allPermissions.push(...role.permissions);
    });

    return allPermissions;
  }

  async hasRole(userId: number, roleName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    if (!user) {
      return false;
    }

    return user.roles.some((role) => role.userId === userId);
  }


  async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    const permissions = await this.getPermissionsForUser(userId);
    return permissions.some((permission) => permission.name === permissionName);
  }
}
