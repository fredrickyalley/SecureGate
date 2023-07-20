import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Prisma } from '@prisma/client';

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
    AuthModule.forRoot({
      // Configure the authentication options here based on user-defined settings
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      // Add any other configuration properties as needed
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
