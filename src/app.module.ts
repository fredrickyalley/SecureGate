import { Module, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { SecureAuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

import { Prisma } from '@prisma/client';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './mailer/mail.module';

@Module({
  imports: [
    DatabaseModule.forRoot({
      // Configure the Prisma client options here based on user-defined database and models
      // For example:
      datasources: {
       db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Add your user-defined models here
      // models: {
      //   User: {
      //     // Model configuration
      //   },
      // },
    } as Prisma.PrismaClientOptions),
    SecureAuthModule.forRoot({
      // Configure the authentication options here based on user-defined settings
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
      // Add any other configuration properties as needed
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
  ],

})
export class SecureGateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/signup', method: RequestMethod.POST }, 
        { path: 'auth/forgot-password', method: RequestMethod.POST }, 
        )
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply the middleware to all other routes
  }
}
