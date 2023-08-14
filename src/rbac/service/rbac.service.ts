import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Permission} from '@prisma/client';
import { PrismaService } from '../../auth/prismaService/prisma.service';
import { RoleDto,  AssignRoleToUserDto, PermissionDto, AssignPermissionToRoleDto} from '../dto/permission-role.dto';
import { isNumber } from 'class-validator';


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
   * @param {PermissionDto} permissionDto - The data for creating the new permission.
   * @returns {Promise<Permission>} A promise that resolves to the created Permission object.
   * @throws {HttpException} If the permission with the same name already exists.
   */
  async createPermission(
    permissionDto: PermissionDto,
  ): Promise<Permission> {
    const { name } = permissionDto;

    if(isNumber(parseInt(name, 10))) throw new BadRequestException("Permission can't be a number")

    const permission = await this.prisma.permission.findFirst({
      where: { name, deletedAt: null },
    });
    if (permission) throw new BadRequestException('Permission already exists');

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
    updatePermissionDto: PermissionDto,
  ): Promise<Permission> {
    const {name} = updatePermissionDto

    if(isNumber(parseInt(name, 10))) throw new BadRequestException("Permission can't be a number")

    const permission = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
    });
    if (!permission) throw new NotFoundException(`Permission ${id} not found`);
    if(permission.name === name) throw new BadRequestException(`Permission ${name} can not be the same as old name`)

    return this.prisma.permission.update({
      where: { id, deletedAt: null },
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
      include: {permissions: true}
    });

    if (!role) throw new NotFoundException(`Role ${roleId} not found`);

    return role;
  }

  /**
   * Creates a new role.
   *
   * @param {RoleDto} roleDto - The data for creating the new role.
   * @returns {Promise<Role>} A promise that resolves to the created Role object.
   * @throws {HttpException} If the role with the same name already exists.
   */
  async createRole(roleDto: RoleDto): Promise<Role> {
    const { name } = roleDto;

    if(isNumber(parseInt(name, 10))) throw new BadRequestException("Role can't be a number")

    const role = await this.prisma.role.findUnique({
      where: { name },
      include: {permissions: true}
    });
    if(role !== null) {
      if(role && role.deletedAt === null) throw new BadRequestException(`Role ${name} already exists`);
      if(role.deletedAt !== null) throw new BadRequestException(`Role ${name} exist already, change it deletedAt to null`)
    }

      return await this.prisma.role.create({ data: { name } });
  }


  async updateRole(roleId: number, updateRoleDto: RoleDto): Promise<Role> {
    const { name } = updateRoleDto;

    if(isNumber(parseInt(name, 10))) throw new BadRequestException("Permission can't be a number")

    const role = await this.prisma.role.findFirst({
      where: { id:roleId, deletedAt: null },
      include: {permissions: true}
    });

      if(!role) throw new NotFoundException(`Role ${name} does not exists`);
      if(role.name === name) throw new BadRequestException(`Role ${name} can not be same as old name`)

      return await this.prisma.role.update({where: {id: roleId, deletedAt: null}, data: { name } });

  }

    /**
   * Deactivate a Permission by its ID.
   *
   * @param {number} permissionId - The ID of the role to delete.
   * @returns {Promise<void>} A promise that resolves when the role is deleted successfully.
   * @throws {NotFoundException} If the role with the specified ID is not found.
   * @throws {BadRequestException} If the role has already been deleted.
   */
    async deactivePermission(permissionId: number): Promise<void> {
      const role = await this.prisma.permission.findFirst({ where: { id: permissionId, deletedAt: null } });
      if (!role || role.deletedAt !== null)
        throw new NotFoundException(`Role ${permissionId} not found`);
  
      if (role.deletedAt === null) {
        await this.prisma.permission.update({
          where: { id: permissionId, deletedAt: null },
          data: { deletedAt: new Date(Date.now()) },
        });
      } else {
        throw new BadRequestException('Role already deleted');
      }
    }
  
    async reactivatePermission(permissionId: number): Promise<void> {
      const role = await this.prisma.permission.findFirst({
        where: { id: permissionId, deletedAt: { not: null } },
      });
    
      if (!role) throw new NotFoundException(`Role ${permissionId} not found`);
  
    
      if (role.deletedAt !== null) {
        await this.prisma.permission.update({
          where: { id: permissionId },
          data: { deletedAt: null },
        });
      } else {
        throw new BadRequestException('Role is not deleted');
      }
    }


  async deletePermission(permissionId: number): Promise<void> {
    const role = await this.prisma.role.findFirst({
      where: { id: permissionId },
    });
  
    if (!role) throw new NotFoundException(`Permission ${permissionId} not found`);


    await this.prisma.permission.delete({
      where: { id: permissionId }
    })
  }

  async asignPermissionToRole(assignPermissionToRoleDto: AssignPermissionToRoleDto): Promise<void> {
    const {roleId, permissionIds} = assignPermissionToRoleDto

    const role = await this.prisma.role.findFirst({
      where: { id: roleId, deletedAt: null },
      include: {permissions: true}
    });

    if(!role) throw new NotFoundException(`Role ${roleId} does not exists`);

    for(let permissionId of permissionIds) {
      const permission = await this.prisma.permission.findFirst({where: {id: permissionId, deletedAt: null}});
        
      if (!permission) throw new NotFoundException(`Permission ${permissionId} not found`);

      const permissionInRole = role.permissions.find((p) => p.id === permissionId);

      if (!permissionInRole) {
        throw new BadRequestException(`Permission ${permissionId} not associated with Role ${role.name}`);
      }
    } 

     permissionIds.forEach( async (permissionId) => {
       await this.prisma.role.update({
        where: {id: roleId, deletedAt: null},
        data: {
          permissions: {
            connect: {
              id: permissionId,
            },
          },
        },
      });
    });     
  }



  /**
 * Removes permissions from a role based on the provided DTO.
 * @async
 * @param {RemovePermissionFromRoleDto} removePermissionFromRoleDto - The DTO containing roleId and permissionIds.
 * @throws {NotFoundException} If the role or permission is not found.
 * @throws {HttpException} If a permission is not associated with the role.
 */
async removePermissionFromRole(removePermissionFromRoleDto: AssignPermissionToRoleDto): Promise<void> {
  const { roleId, permissionIds } = removePermissionFromRoleDto;

  const role = await this.prisma.role.findFirst({
    where: { id: roleId, deletedAt: null },
    include: { permissions: true },
  });

  if (!role) throw new NotFoundException(`Role ${roleId} does not exist`);

  for (const permissionId of permissionIds) {
    const permission = await this.prisma.permission.findFirst({
      where: { id: permissionId, deletedAt: null },
    });

    if (!permission) throw new NotFoundException(`Permission ${permissionId} not found`);

    const permissionInRole = role.permissions.find((p) => p.id === permissionId);

    if (!permissionInRole) throw new BadRequestException(`Permission ${permissionId} not associated with Role ${role.name}`);
  }

  const permissionDisconnects = permissionIds.map((permissionId) => ({ id: permissionId }));

  await this.prisma.role.update({
    where: { id: roleId, deletedAt: null },
    data: {
      permissions: {
        disconnect: permissionDisconnects,
      },
    },
  });
}


  /**
   * Updates a role by its ID.
   *
   * @param {UpdatePermissionToRoleDto} updatePermissionToRoleDto - The data for updating the role.
   * @returns {Promise<void>} 
   * @throws {NotFoundException} If the role with the specified ID is not found.
   */
  async updatePermissionsToRoles(
    updatePermissionToRoleDto: AssignPermissionToRoleDto,
  ): Promise<void> {
    const { roleId, permissionIds } = updatePermissionToRoleDto;

    if (permissionIds.length === 0 || !roleId) throw new BadRequestException('Invalid role ID or permissions');

      const role = await this.prisma.role.findFirst({
        where: { id: roleId, deletedAt: null },
        select: { permissions: true },
      });
      if (!role) throw new NotFoundException('Role does not exist');

      let permission: Permission; 
      

      for(let permissionId of permissionIds) {
        permission = await this.prisma.permission.findFirst({
          where: { id: permissionId, deletedAt: null },
        });
        if (!permission) throw new NotFoundException('Permission does not exist');
      }

      for (const permission of role.permissions) {
        if (permissionIds.includes(permission.id)) throw new BadRequestException('Permission already exists');
      }


      permissionIds.forEach(async (permissionId) => {
        await this.prisma.role.update({
          where: { id: roleId, deletedAt: null },
          data: {
            permissions: {
              connect: {
                id: permissionId,
              },
            },
          },
        });

      })


  }

  /**
   * Deletes a role by its ID.
   *
   * @param {number} roleId - The ID of the role to delete.
   * @returns {Promise<void>} A promise that resolves when the role is deleted successfully.
   * @throws {NotFoundException} If the role with the specified ID is not found.
   * @throws {BadRequestException} If the role has already been deleted.
   */
  async deactiveRole(roleId: number): Promise<void> {
    const role = await this.prisma.role.findFirst({ where: { id: roleId, deletedAt: null } });
    if (!role || role.deletedAt !== null)
      throw new NotFoundException(`Role ${roleId} not found`);

    if (role.deletedAt === null) {
      await this.prisma.role.update({
        where: { id: roleId, deletedAt: null },
        data: { deletedAt: new Date(Date.now()) },
      });
    } else {
      throw new BadRequestException('Role already deleted');
    }
  }

  async reactivateRole(roleId: number): Promise<void> {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, deletedAt: { not: null } },
    });
  
    if (!role) throw new NotFoundException(`Role ${roleId} not found`);

  
    if (role.deletedAt !== null) {
      await this.prisma.role.update({
        where: { id: roleId },
        data: { deletedAt: null },
      });
    } else {
      throw new BadRequestException('Role is not deleted');
    }
  }

  async deleteRole(roleId: number): Promise<void> {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId },
    });
  
    if (!role) throw new NotFoundException(`Role ${roleId} not found`);


    await this.prisma.role.delete({
      where: { id: roleId }
    })
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
      where: { id: roleId, deletedAt: null },
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
 * Disconnects a role from a user based on the provided DTO.
 *
 * @async
 * @param {RevokeRoleOfUserDto} revokeRoleOfUserDto - The DTO containing userId and roleId.
 * @throws {NotFoundException} If the user or role is not found.
 * @throws {HttpException} If the user doesn't have the specified role.
 */
async revokeRoleOfUser(revokeRoleOfUserDto: AssignRoleToUserDto): Promise<void> {
  const { userId, roleId } = revokeRoleOfUserDto;

  const user = await this.prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
  });

  if (!user) throw new NotFoundException('User not found');

  const role = await this.prisma.role.findFirst({
      where: { id: roleId, user: { some: { id: userId } } }
  });

  if (!role) throw new NotFoundException('Role not found');

  await this.prisma.role.update({
      where: { id: roleId, deletedAt: null },
      data: {
          user: {
              disconnect: { id: userId }
          }
      }
  });
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
      include: { roles: { include: { permissions: { where: { deletedAt: null } } } } },
    });
  
    const allPermissions: Permission[] = userWithRoles.roles
      .flatMap((role) => role.permissions)
      .filter((permission) => permission.deletedAt === null);
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
    if (user.roles.length === 0) return false;

    for (const role of user.roles) {
      const roles = await this.prisma.role.findFirst({
        where: { id: role.id, deletedAt: null },
      });
      if (requiredRoles.includes(roles.name)) return true;
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
      if (requiredPermissions.includes(permission.name)) return true;
    }

    return false;
  }
}
