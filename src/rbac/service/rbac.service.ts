import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, RoleUser, Permission, User } from '@prisma/client';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(): Promise<Role[]> {
    return this.prisma.role.findMany({where: {deletedAt: null}});
  }

  async getRoleById(roleId: number): Promise<Role | null> {
    return this.prisma.role.findFirst({ where: { id: roleId, deletedAt: null } });
  }

  async getPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({where: {deletedAt: null}});
  }

  async createRole(name: string): Promise<Role> {
    const role = this.prisma.role.findFirst({ where: { name: name, deletedAt: null}});

    if (role) throw new HttpException('Role already exists', 400);

    return this.prisma.role.create({ data: { name } });
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<RoleUser> {
    const user = this.prisma.roleUser.findFirst({
      where: { userId: userId, roleId: roleId, deletedAt: null}
    })

    if (user) throw new HttpException('User already has this role', 400);

    return this.prisma.roleUser.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async revokeRoleFromUser(userId: number, roleId: number): Promise<void> {
    const userRole = await this.prisma.roleUser.findUnique({
      where: {
        userId_roleId: {
          userId, 
          roleId
        }, 
      }
    });

    if(userRole.deletedAt !== null ) throw new NotFoundException('User role does not exist')

    await this.prisma.roleUser.update({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
        deletedAt: null
      },
      data: {deletedAt: new Date(Date.now())},
    });
  }

  async reassignRoleFromUser(userId: number, roleId: number): Promise<void> {
    const userRole = await this.prisma.roleUser.findUnique({
      where: {
        userId_roleId: {
          userId, 
          roleId
        }, 
      }
    });

    if(userRole.deletedAt === null ) throw new HttpException('User role already exist', 400)

    await this.prisma.roleUser.update({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      data: {deletedAt: null},
    });
  }

  async getPermissionsForUser(userId: number, requiredPermissions: string[]): Promise<Permission[]> {
    const userWithRoles = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { roles: { include: { role: { select: {permissions: true, deletedAt: true}}} } },
    });
    // console.log(userWithRoles)
    const allPermissions: Permission[] = [];
    const roles =  userWithRoles.roles;

    roles.forEach((role) => { role.role.permissions.forEach((element) => { 
      if(element.deletedAt === null) allPermissions.push(element)} 
      )
 
    });
    // console.log(allPermissions)

    if(allPermissions.length === 0) return []
  
    return allPermissions;
  }

  // async hasRole(userId: number): Promise<boolean> {
  //   const user = await this.prisma.user.findFirst({
  //     where: { id: userId, deletedAt: null },
  //     include: { roles: true },
  //   });
  
  //   if (!user) {
  //     return false;
  //   }
  //   console.log(user.roles)
  //   if(user.roles.length === 0) {
  //     return false;
  //   }

  //   return user.roles.some((role) => {
  //     role.userId === userId && role.deletedAt === null
  //   });
  // }

  async hasRoles(userId: any, requiredRoles: string[]): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
        include: { roles: true },
    })

    if (user.roles.length === 0) {
      return false;
    }
  
    for (const role of user.roles) {
      if (role.userId === user.id && role.deletedAt === null) {
        return true;
      }
    }
  
    return false;
  }


  async hasPermission(userId: number, requiredPermissions: string[]): Promise<boolean> {
    const permissions = await this.getPermissionsForUser(userId, requiredPermissions);
    console.log(permissions);

    for(const permission of permissions) {
      if(requiredPermissions.includes(permission.name)) { 
        return true;
      }
    }

    return false;
  }
}
