// mailer.module.ts

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { AuthConfigure } from 'auth/interfaces/auth.interface';
import { MailService } from './mail.service';

/**
 * Module responsible for handling email functionality, including mailer configuration and service.
 *
 * @module MailModule
 */
@Module({
  /**
   * External modules that need to be imported and configured by the MailModule.
   */
  imports: [
    /**
     * Configures the MailerModule for asynchronous use with a factory function.
     */
    MailerModule.forRootAsync({
      /**
       * Factory function that asynchronously returns the Mailer options based on the provided configuration.
       * @param {ConfigService<AuthConfigure>} config - The configuration service for authentication.
       * @returns {Promise<MailerOptions>} The options for configuring the Mailer.
       */
      useFactory: async (config: ConfigService<AuthConfigure>) => {
        return {
          transport: {
            host: config.get('emailTransporter').host,
            port: config.get('emailTransporter').port,
            secure: false,
            auth: {
              user: config.get('emailTransporter').auth.user,
              pass: config.get('emailTransporter').auth.pass,
            },
          },
          defaults: {
            from: config.get('emailTransporter').sender,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      /**
       * Dependencies that need to be injected into the useFactory function.
       */
      inject: [ConfigService],
    }),
  ],
  /**
   * List of providers that will be registered and instantiated by the NestJS container.
   */
  providers: [MailService],
  /**
   * List of providers that will be exported and can be used by other modules.
   */
  exports: [MailService],
})
export class MailModule {}

