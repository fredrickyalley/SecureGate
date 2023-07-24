// mailer.module.ts

import { Module } from '@nestjs/common';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { AuthConfigure } from 'src/auth/interfaces/auth.interface';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService<AuthConfigure>) => {
        return {
          transport: {
            host: config.get('emailTransporter').host,
            port: config.get('emailTransporter').port,
            secure: false,
            auth: {
              user: config.get('emailTransporter').auth.user,
              pass: config.get('emailTransporter').auth.pass,
            }
            
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
