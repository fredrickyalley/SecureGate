import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {
    // Define the options for the JWT strategy
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Replace with your actual JWT secret key
    };

    // Create the JWT strategy and use it with passport
    passport.use(
      new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
          const user = await this.authService.validateTokenPayload(payload);
          done(null, user); // User found, attach the user to the request.
        } catch (err) {
          done(new UnauthorizedException('Invalid token'));
        }
      })
    );

    // // Create the OAuth2 strategy and use it with passport
    // passport.use(
    //   new OAuth2Strategy(
    //     {
    //       authorizationURL: 'https://example.com/oauth2/authorize',
    //       tokenURL: 'https://example.com/oauth2/token',
    //       clientID: process.env.OAUTH_CLIENT_ID, // Replace with your OAuth client ID
    //       clientSecret: process.env.OAUTH_CLIENT_SECRET, // Replace with your OAuth client secret
    //       callbackURL: 'https://your-app/callback', // Replace with your callback URL
    //     },
    //     async (accessToken, refreshToken, profile, done) => {
    //       try {
    //         // Implement your custom logic to fetch or create the user from the profile
    //         const user = await this.authService.findOrCreateUserFromOAuthProfile(profile);
    //         done(null, user); // User found/created, attach the user to the request.
    //       } catch (err) {
    //         done(err);
    //       }
    //     }
    //   )
    // );
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Use the passport.authenticate middleware to trigger the JWT or OAuth2 authentication process
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new UnauthorizedException('Unauthorized'));
      }

      // Attach the user object to the request
      req.user = user;
      next();
    })(req, res, next);
  }
}
