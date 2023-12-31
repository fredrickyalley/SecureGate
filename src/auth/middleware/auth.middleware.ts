import { HttpException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { SecureAuthService } from '../services/auth.service';

/**
 * Injectable middleware responsible for handling JWT and OAuth2 authentication.
 *
 * @class
 * @name AuthMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    /**
   * Creates an instance of the AuthMiddleware.
   *
   * @constructor
   * @param {SecureAuthService} authService - The SecureAuthService used for authentication and user validation.
   */
  constructor(private readonly authService: SecureAuthService) {
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

  //   // Create the OAuth2 strategy and use it with passport
  //   passport.use(
  //     new OAuth2Strategy(
  //       {
  //         authorizationURL: 'https://example.com/oauth2/authorize',
  //         tokenURL: 'https://example.com/oauth2/token',
  //         clientID: process.env.OAUTH_CLIENT_ID, // Replace with your OAuth client ID
  //         clientSecret: process.env.OAUTH_CLIENT_SECRET, // Replace with your OAuth client secret
  //         callbackURL: 'https://your-app/callback', // Replace with your callback URL
  //       },
  //       async (accessToken, refreshToken, profile, done) => {
  //         try {
  //           // Implement your custom logic to fetch or create the user from the profile
  //           const user = await this.authService.findOrCreateUserFromOAuthProfile(profile);
  //           done(null, user); // User found/created, attach the user to the request.
  //         } catch (err) {
  //           done(err);
  //         }
  //       }
  //     )
  //   );
  }

   /**
   * Middleware function to handle JWT and OAuth2 authentication.
   *
   * @function
   * @async
   * @name use
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The NextFunction to continue the middleware chain.
   * @returns {void}
   */

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
