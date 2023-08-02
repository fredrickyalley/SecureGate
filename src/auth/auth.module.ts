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


/**
 * NestJS module for secure authentication and authorization.
 *
 * @class
 * @exports
 */
@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [SecureAuthService, SecureUserService, SecureRbacService],
  exports: [SecureAuthService]
})
export class SecureAuthModule {
  /**
   * Registers the `SecureAuthModule` with optional configuration options for JWT and other authentication-related settings.
   *
   * @static
   * @param {AuthConfig} options - Configuration options for authentication.
   * @returns {DynamicModule} - The registered `SecureAuthModule` with the provided options.
   */
  static forRoot(options?: AuthConfig): DynamicModule {
    // Configure JWT module options based on provided options
    const jwtModuleOptions: JwtModuleOptions = {
      secret: options.jwt.secret,
      signOptions: {
        expiresIn: options.jwt.expiresIn,
      },
    };

    // Register JWT module
    const jwtModule = JwtModule.register(jwtModuleOptions);

    // Define the provider for the authentication configuration
    const authConfigProvider = {
      provide: 'AUTH_CONFIG',
      useValue: options,
    };

    // Assemble the dynamic module
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
