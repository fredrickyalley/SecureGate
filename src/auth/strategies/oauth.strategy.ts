import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-oauth2';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user.interface';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
  // constructor(private readonly authService: AuthService) {
  //   super({
  //     authorizationURL: 'https://oauth-provider.com/auth',
  //     tokenURL: 'https://oauth-provider.com/token',
  //     clientID: 'your-client-id',
  //     clientSecret: 'your-client-secret',
  //     callbackURL: 'http://your-app.com/auth/callback',
  //   });
  // }

  // async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
  //   return this.authService.validateOAuthUser(profile);
  // }
}
