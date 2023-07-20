import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return super.canActivate(context);
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Assuming the user object contains a `roles` property representing the user's roles

    // Check if the user's roles include any of the allowed roles
    const hasRole = roles.some((role) => user.roles.includes(role));

    return hasRole && super.canActivate(context);
  }
}
