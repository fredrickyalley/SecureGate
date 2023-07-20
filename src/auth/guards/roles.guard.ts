import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // No roles specified, access granted
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user's role matches any of the allowed roles
    const hasRole = roles.some((role) => role === user.role);

    return hasRole;
  }
}
