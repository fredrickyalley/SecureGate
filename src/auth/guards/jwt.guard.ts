import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { SecureRbacService } from 'rbac/service/rbac.service';

/**
 * Custom JWT AuthGuard that extends the default AuthGuard('jwt') provided by NestJS.
 * This class adds role-based access control (RBAC) by checking if the user has the required roles.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Constructor of the JwtAuthGuard class.
   * @param {Reflector} reflector - The reflector used to retrieve metadata for the handler.
   */
  constructor(private reflector: Reflector, private readonly rbacService: SecureRbacService,) {
    super();
  }

  /**
   * Method to determine if the user is authorized to access the route.
   * @param {ExecutionContext} context - The context of the current request.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - A boolean indicating if the user is authorized.
   */
  async canActivate(context: ExecutionContext):  Promise<boolean>  {
   // Run the JWT authentication using the AuthGuard
   const canActivate = await super.canActivate(context);
   if (!canActivate) {
     return false;
   }

    // Extract the user object from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()) || [];

    // Assuming the user object contains a `roles` property representing the user's roles
    // Check if the user has any of the required roles
        // Check if the user has the required roles
        const hasRoles = await this.rbacService.hasRoles(user.id, requiredRoles);

    // const hasRole = roles.some((role) => user.roles.includes(role));
    if (!hasRoles ) {
      throw new UnauthorizedException('You do not have role access to this resource.');
    }

    return true;
  }
}

