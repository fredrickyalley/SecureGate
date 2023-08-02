import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { SecureAuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';

/**
 * Passport JWT strategy for handling JWT-based authentication.
 *
 * @class
 * @extends PassportStrategy(Strategy, 'jwt')
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Creates an instance of JwtStrategy.
   *
   * @constructor
   * @param {SecureAuthService} authService - The instance of the SecureAuthService used for validating token payloads.
   * @param {ConfigService} config - The instance of the ConfigService used for retrieving the JWT secret key.
   */
  constructor(private readonly authService: SecureAuthService, config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  /**
   * Validates the payload of a JWT token by calling the `validateTokenPayload` method of the `SecureAuthService`.
   *
   * @async
   * @param {any} payload - The decoded payload of the JWT token.
   * @returns {Promise<{}>} - The user associated with the payload if valid.
   */
  async validate(payload: any): Promise<{}> {
    return this.authService.validateTokenPayload(payload);
  }
}

