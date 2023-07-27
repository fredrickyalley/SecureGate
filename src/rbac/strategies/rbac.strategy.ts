import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { SecureRbacService } from '../service/rbac.service';

@Injectable()
export class RbacStrategy extends AuthGuard('jwt') {
  constructor(private readonly rbacService: SecureRbacService, private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Run the JWT authentication using the AuthGuard
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // Get the user object from the request
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    // Get the required roles and permissions from the route metadata
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    // Check if the user has the required roles
    
    const hasRoles = await this.rbacService.hasRoles(user.id, requiredRoles);
    // const hasRoles = requiredRoles.every( async (role) =>  await this.rbacService.hasRole(user.id) );
    console.log(hasRoles)
    // Check if the user has the required permissions
    const hasPermissions = await this.rbacService.hasPermission(user.id, requiredPermissions);
        // const hasPermissions = requiredPermissions.every(async (permission) => await this.rbacService.hasPermission(user.id, permission));
    // const hasPermissions = requiredPermissions.every(async (permission) => await this.rbacService.hasPermission(user.id, permission));
    console.log(hasPermissions)
    if (!hasRoles || !hasPermissions) {
      throw new UnauthorizedException('You do not have permission to access this resource.');
    }

    return true;
  }
}
