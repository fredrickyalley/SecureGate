import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfig } from './interfaces/auth.interface';
import configuration from './config/auth.config'
import { MailModule } from 'src/mailer/mail.module';
import { UserService } from 'src/user/service/user.service';
import { RbacService } from 'src/rbac/service/rbac.service';



@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, RbacService]
})
export class AuthModule {
  static forRoot(options?: AuthConfig): DynamicModule {
    const jwtModuleOptions: JwtModuleOptions = {
      secret: options.jwt.secret,
      signOptions: {
        expiresIn: options.jwt.expiresIn,
      },
    };

    const jwtModule = JwtModule.register(jwtModuleOptions);

    const authConfigProvider = {
      provide: 'AUTH_CONFIG',
      useValue: options,
    };

    return {
      module: AuthModule,
      imports: [
        jwtModule,
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        authConfigProvider,
        {
          provide: ConfigService,
          useClass: ConfigService,
        },
      ],
      exports: [AuthService],
    };
  }
}
