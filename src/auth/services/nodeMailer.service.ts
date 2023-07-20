import * as nodemailer from 'nodemailer';

export interface EmailService {
    sendEmail(from: string, to: string, subject: string, body: string): Promise<void>;
  }
  
 export class NodemailerEmailService implements EmailService {
    async sendEmail(from: string, to: string, subject: string, body: string): Promise<void> {
      // Implement the logic to send emails using Nodemailer
      // Example code:
      const transporter = nodemailer.createTransport({
        // Configure the transporter options (e.g., SMTP settings)
      });
  
      const mailOptions = {
        from,
        to,
        subject,
        text: body,
      };
  
      await transporter.sendMail(mailOptions);
    }
  }
  