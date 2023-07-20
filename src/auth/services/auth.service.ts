import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthConfigure } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';
import { LoginDto } from '../dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { EmailService, NodemailerEmailService } from './nodeMailer.service';
import * as nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';


interface TokenPayload {
    username: string;
    sub: number;
    // Add any additional properties you expect in the payload
    // For example: roles: string[];
  }

@Injectable()
export class AuthService {
  private readonly forgotPasswordConfig: AuthConfigure['forgotPassword'];
  private readonly emailConfig: AuthConfigure['email'];
  private readonly emailTransporterConfig: AuthConfigure['emailTransporter'];
  private transporter: nodemailer.Transporter;

  constructor( 
    private prisma: PrismaService, 
    private readonly configService: ConfigService<AuthConfigure>, 
    private readonly jwtService: JwtService,
    ) {
    // this.forgotPasswordConfig = this.configService.get('forgotPassword');
    // this.emailConfig = this.configService.get('email');
    this.emailTransporterConfig = this.configService.get('emailTransporter');
    // this.transporter = this.createTransporter();
  }

  // private createTransporter(): nodemailer.Transporter {
  //   const { host, port, secure, auth } = this.emailTransporterConfig;

  //   return nodemailer.createTransport({
  //     host: host,
  //     port: port,
  //     secure: secure,
  //     auth: auth,
  //   });
  // }


  async validateTokenPayload(payload: TokenPayload): Promise<{}> {
    // Implement your logic to validate and retrieve the user based on the payload
    // This could involve querying a user repository or data source.
    
    const user = await this.prisma.user.findUnique({where: {id: payload.sub}});
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  async validateOAuthUser(profile: any): Promise<User> {
    // Implement your logic to validate and retrieve the user from the OAuth provider
    // This could involve querying the user repository or creating a new user if it doesn't exist
    // You can also map the relevant properties from the OAuth provider's profile to your user interface
    const user: User = {
      id: profile.id,
      username: profile.username,
      password: '',
      roles: ['user'],
      // Add any additional properties based on the OAuth provider's profile
    };

    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { username, password } = loginDto;
    const user = await this.prisma.user.findFirst({ where: { username: username } });
  
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
  
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
  
    return { access_token};
  }
  

  async signup(username: string, password: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await this.prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        roles: ['user'], 
      },
    });

    return newUser;
  }

  async resetPassword(username: string, newPassword: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return updatedUser;
  }

  // async forgotPassword(email: string): Promise<void> {
  //   // Generate a unique reset token
  //   const resetToken = this.generateRandomString(32);

  //   // Store the reset token in your database or temporary storage with an expiration time
  //   const resetTokenExpiration = Date.now() + this.forgotPasswordConfig.resetPasswordExpiration;
  //   await this.storeResetToken(email, resetToken, resetTokenExpiration);

  //   // Compose the reset URL with the reset token and expiration time
  //   const resetUrl = `${this.forgotPasswordConfig.resetPasswordUrl}?token=${resetToken}`;

  //   // Send the password reset email to the user with the reset URL
  //   await this.sendResetPasswordEmail(email, resetUrl);
  // }

  async storeResetToken(email: string, resetToken: string, expiration: number): Promise<void> {
    // Store the reset token and expiration in your database or temporary storage
    // Example code using a database query or an ORM (e.g., Prisma):
    await this.prisma.user.update({
      where: { username: email },
      data: { resetToken, resetTokenExpiration: new Date(expiration) },
    });
  }

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // async sendResetPasswordEmail(email: string, resetUrl: string): Promise<void> {
  //   const { sender } = this.emailTransporterConfig;
  //   const subject = 'Password Reset';
  //   const body = `Click on the following link to reset your password: ${resetUrl}`;

  //   // Use the configured transporter to send the email
  //   const mailOptions = {
  //     from: sender,
  //     to: email,
  //     subject,
  //     text: body,
  //   };

  //   await this.transporter.sendMail(mailOptions);
  // }

  private getEmailService(provider: string): EmailService {
    // Implement logic to get the appropriate email service based on the provider
    // This could involve using conditional statements or a factory pattern

    // Example: Using Nodemailer as the email service
    if (provider === 'nodemailer') {
      return new NodemailerEmailService();
    }

    // Add other email service providers as needed

    throw new Error(`Unsupported email service provider: ${provider}`);
  }

}
