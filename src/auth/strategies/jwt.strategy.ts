import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { jwtConstants } from '../constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // constructor(private readonly authService: AuthService, config: ConfigService) {
  //   super({
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     secretOrKey: config.get('JWT_SECRET'),
  //   });
  // }

  // async validate(payload: any) {
  //   return this.authService.validateTokenPayload(payload);
  // }
}
