import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { SecureRbacService } from '../service/rbac.service';

/**
 * Custom RBAC (Role-Based Access Control) AuthGuard that extends the JwtAuthGuard.
 * This guard checks if the authenticated user has the required roles and permissions to access a specific route.
 *
 * @class
 */
@Injectable()
export class RbacAuthGuard extends AuthGuard('jwt') {
  /**
   * Creates an instance of RbacAuthGuard.
   *
   * @constructor
   * @param {SecureRbacService} rbacService - The RBAC service to check user roles and permissions.
   * @param {Reflector} reflector - The NestJS reflector used to get metadata from the route handlers.
   */
  constructor(private readonly rbacService: SecureRbacService, private readonly reflector: Reflector) {
    super();
  }

  /**
   * Method that checks if the authenticated user has the required roles and permissions to access a specific route.
   * Overrides the `canActivate` method of the parent class.
   *
   * @async
   * @method
   * @param {ExecutionContext} context - The execution context containing the request and response objects.
   * @returns {Promise<boolean>} A boolean indicating whether the user is authorized to access the route or not.
   * @throws {UnauthorizedException} If the user does not have the required roles or permissions.
   */
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

    // Check if the user has the required permissions
    const hasPermissions = await this.rbacService.hasPermission(user.id, requiredPermissions);

    if (!hasRoles || !hasPermissions) {
      throw new UnauthorizedException('You do not have permission to access this resource.');
    }

    return true;
  }
}

