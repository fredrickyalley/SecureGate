import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-oauth2';
import { SecureAuthService } from '../services/auth.service';
import { User } from '@prisma/client';

/**
 * Passport OAuth strategy for handling OAuth-based authentication.
 *
 * @class
 * @extends PassportStrategy(Strategy, 'oauth')
 */
@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
  /**
   * Creates an instance of OAuthStrategy.
   *
   * @constructor
   * @param {SecureAuthService} authService - The instance of the SecureAuthService used for handling OAuth authentication.
   */
  constructor(private readonly authService: SecureAuthService) {
    super({
      authorizationURL: 'https://oauth-provider.com/auth',
      tokenURL: 'https://oauth-provider.com/token',
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret',
      callbackURL: 'http://your-app.com/auth/callback',
    });
  }

  /**
   * Validates the user obtained from the OAuth provider by calling the `findOrCreateUserFromOAuthProfile` method
   * of the `SecureAuthService`.
   *
   * @async
   * @param {string} accessToken - The access token obtained from the OAuth provider.
   * @param {string} refreshToken - The refresh token obtained from the OAuth provider.
   * @param {Profile} profile - The user profile received from the OAuth provider.
   * @returns {Promise<User>} - The user associated with the OAuth profile.
   */
  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
    return this.authService.findOrCreateUserFromOAuthProfile(profile);
  }
}

