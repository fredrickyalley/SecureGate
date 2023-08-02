import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

/**
 * Injectable service responsible for sending emails using the MailerService.
 *
 * @class
 * @name MailService
 */
@Injectable()
export class MailService {
  /**
   * Creates an instance of the MailService.
   *
   * @constructor
   * @param {MailerService} mailerService - The MailerService used to send emails.
   */
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Asynchronously sends an email to the specified recipient using the configured MailerService.
   *
   * @async
   * @function
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The subject of the email.
   * @param {string} template - The name of the email template to be used.
   * @param {object} [context] - Optional data object to be used as the context for the email template.
   * @returns {Promise<void>} A Promise that resolves when the email is sent.
   */
  async sendEmail(to: string, subject: string, template: string, context?: object): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
