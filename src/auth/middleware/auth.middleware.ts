import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(authService: AuthService) {
    // Define the options for the JWT strategy
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Replace with your actual JWT secret key
    };
    // Create the JWT strategy and use it with passport
    passport.use(
      new Strategy(jwtOptions, async (payload, done) => {
        // Here, you can query your database or any other data source to find the user
        // based on the payload data (e.g., user ID) extracted from the JWT.
        // For the sake of simplicity, we'll just attach a dummy user object to the request.
        const user = await authService.validateTokenPayload(payload)
        // const user = { id: payload.sub, roles: payload.roles };
        done(null, user); // User found, attach the user to the request.
      })
    );
    
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Use the passport.authenticate middleware to trigger the JWT authentication process
    passport.authenticate('jwt', { session: false }, (err, user) => {
      console.log(user)
      if (err) {
        return next(err);
      }

      // Attach the user object to the request
      req.user = user;
      next();
    })(req, res, next);
  }
}
