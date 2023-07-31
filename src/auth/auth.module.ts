import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { SecureAuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfig } from './interfaces/auth.interface';
import configuration from './config/auth.config'
import { MailModule } from './mailer/mail.module';
import { SecureUserService } from '../user/service/user.service';
import { SecureRbacService } from '../rbac/service/rbac.service';



@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [SecureAuthService, SecureUserService, SecureRbacService]
})
export class SecureAuthModule {
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
      module: SecureAuthModule,
      imports: [
        jwtModule,
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      controllers: [AuthController],
      providers: [
        SecureAuthService,
        authConfigProvider,
        {
          provide: ConfigService,
          useClass: ConfigService,
        },
      ],
      exports: [SecureAuthService],
    };
  }
}
