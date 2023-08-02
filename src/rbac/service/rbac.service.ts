import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Permission} from '@prisma/client';
import { PrismaService } from '../../auth/prismaService/prisma.service';
import { CreateRoleDto, UpdatePermissionDto, UpdateRoleDto, RevokeRoleOfUserDto, AssignRoleToUserDto, CreatePermissionDto } from '../dto/permission-role.dto';


/**
 * Service class responsible for handling Role-Based Access Control (RBAC) operations.
 *
 * @class
 */
@Injectable()
export class SecureRbacService {
  constructor(private readonly prisma: PrismaService) {}

 /**
   * Retrieves a list of all permissions.
   *
   * @returns {Promise<Permission[]>} A promise that resolves to an array of Permission objects.
   */
  async getPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({ where: { deletedAt: null } });
  }

  /**
   * Creates a new permission.
   *
   * @param {CreatePermissionDto} createPermissionDto - The data for creating the new permission.
   * @returns {Promise<Permission>} A promise that resolves to the created Permission object.
   * @throws {HttpException} If the permission with the same name already exists.
   */
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

  /**
   * Retrieves a permission by its ID.
   *
   * @param {number} id - The ID of the permission to retrieve.
   * @returns {Promise<Permission>} A promise that resolves to the Permission object with the given ID.
   * @throws {NotFoundException} If the permission with the specified ID is not found.
   */
  async getPermissionById(id: number): Promise<Permission> {
    const permission = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
    });
    if (!permission) throw new NotFoundException(`Permission ${id} not found`);
    return permission;
  }

  /**
   * Updates a permission by its ID.
   *
   * @param {number} id - The ID of the permission to update.
   * @param {UpdatePermissionDto} updatePermissionDto - The data for updating the permission.
   * @returns {Promise<Permission>} A promise that resolves to the updated Permission object.
   * @throws {NotFoundException} If the permission with the specified ID is not found.
   */
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


   /**
   * Retrieves a list of all roles.
   *
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
   */
  async getRoles(): Promise<Role[]> {
    return this.prisma.role.findMany({ where: { deletedAt: null } });
  }

  /**
   * Retrieves a role by its ID.
   *
   * @param {number} roleId - The ID of the role to retrieve.
   * @returns {Promise<Role>} A promise that resolves to the Role object with the given ID.
   * @throws {NotFoundException} If the role with the specified ID is not found.
   */
  async getRoleById(roleId: number): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, deletedAt: null },
    });

    if (!role) throw new NotFoundException(`Role ${roleId} not found`);

    return role;
  }

  /**
   * Creates a new role.
   *
   * @param {CreateRoleDto} createRoleDto - The data for creating the new role.
   * @returns {Promise<Role>} A promise that resolves to the created Role object.
   * @throws {HttpException} If the role with the same name already exists.
   */
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

  /**
   * Updates a role by its ID.
   *
   * @param {number} roleId - The ID of the role to update.
   * @param {UpdateRoleDto} updateRoleDto - The data for updating the role.
   * @returns {Promise<Role>} A promise that resolves to the updated Role object.
   * @throws {NotFoundException} If the role with the specified ID is not found.
   */
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

  /**
   * Deletes a role by its ID.
   *
   * @param {number} roleId - The ID of the role to delete.
   * @returns {Promise<void>} A promise that resolves when the role is deleted successfully.
   * @throws {NotFoundException} If the role with the specified ID is not found.
   * @throws {HttpException} If the role has already been deleted.
   */
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

   /**
   * Assigns a role to a user.
   *
   * @param {AssignRoleToUserDto} assignRoleToUser - The data for assigning the role to the user.
   * @returns {Promise<void>} A promise that resolves when the role is assigned to the user successfully.
   * @throws {NotFoundException} If the user or role with the specified ID is not found.
   * @throws {HttpException} If the user already has the specified role.
   */
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

  /**
   * Revokes a role from a user.
   *
   * @param {RevokeRoleOfUserDto} revokeRoleOfUser - The data for revoking the role from the user.
   * @returns {Promise<void>} A promise that resolves when the role is revoked from the user successfully.
   * @throws {NotFoundException} If the user or role with the specified ID is not found.
   * @throws {HttpException} If the user role has already been revoked or the role is already deleted.
   */
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

  /**
   * Reassigns a revoked role to a user.
   *
   * @param {AssignRoleToUserDto} assignRoleToUserDto - The data for reassigning the role to the user.
   * @returns {Promise<void>} A promise that resolves when the role is reassigned to the user successfully.
   * @throws {NotFoundException} If the user role with the specified ID is not found.
   * @throws {HttpException} If the user role has not been revoked.
   */
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

  /**
   * Retrieves a list of permissions assigned to a user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Permission[]>} A promise that resolves to an array of Permission objects.
   */
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

  /**
   * Checks if a user has specific roles.
   *
   * @param {number} userId - The ID of the user.
   * @param {string[]} requiredRoles - An array of role names required for access.
   * @returns {Promise<boolean>} A promise that resolves to true if the user has all the required roles; otherwise, false.
   */
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

  /**
   * Checks if a user has specific permissions.
   *
   * @param {number} userId - The ID of the user.
   * @param {string[]} requiredPermissions - An array of permission names required for access.
   * @returns {Promise<boolean>} A promise that resolves to true if the user has all the required permissions; otherwise, false.
   */
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
