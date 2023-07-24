import { Injectable, UnauthorizedException, HttpException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthConfigure, TokenPayload } from '../interfaces/auth.interface';
import { OAuthProfile, User } from '../interfaces/user.interface';
import { LoginDto } from '../dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {MailService} from 'src/mailer/mail.service';
import * as nodemailer from 'nodemailer';


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
    private readonly mailService: MailService,
    ) {
    this.forgotPasswordConfig = this.configService.get('forgotPassword');
    // this.emailConfig = this.configService.get('email');
    this.emailTransporterConfig = this.configService.get('emailTransporter');
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    const { host, port, secure, auth } = this.emailTransporterConfig;

    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: auth,
      tls: {
        // Here you can specify advanced TLS options if needed
        ciphers: 'SSLv3', // Specify the TLS cipher to use (example: 'SSLv3' or 'TLSv1')
        rejectUnauthorized: false, // Set to false to allow self-signed or invalid certificates
        // Other TLS options if required
      },
    });

  }


  async validateTokenPayload(payload: TokenPayload): Promise<{}> {
    // Implement your logic to validate and retrieve the user based on the payload
    // This could involve querying a user repository or data source.
    
    const user = await this.prisma.user.findUnique({where: {id: payload.sub}});
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  async findOrCreateUserFromOAuthProfile(profile: OAuthProfile) {

    // Find the user by the unique identifier (e.g., 'id') in the database
    const existingUser = await this.prisma.user.findUnique({
      where: { id: profile.id },
    });

    if (!existingUser) {
      // If the user is not found, deny access
      throw new NotFoundException('User not found');
    }

    return existingUser;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findFirst({ where: { email: email } });
  
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
  
    return { access_token};
  }
  

  async signup(email: string, password: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        // roles: ['user'], 
      },
      select: {
        id: true,
        email: true,
        password: true,
        roles: true
      },
    });

    return newUser;
  }

  async resetPassword(email: string, newPassword: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        password: true,
        roles: true
      },
    });

    return updatedUser;
  }

  async forgotPassword(email: string): Promise<void> {
    // Generate a unique reset token
    const resetToken = this.generateRandomString(32);

    // Store the reset token in your database or temporary storage with an expiration time
    const resetTokenExpiration = Date.now() + this.forgotPasswordConfig.resetPasswordExpiration;
    await this.storeResetToken(email, resetToken, resetTokenExpiration);

    // Compose the reset URL with the reset token and expiration time
    const resetUrl = `${this.forgotPasswordConfig.resetPasswordUrl}?token=${resetToken}`;
    console.log(resetUrl);
    // Send the password reset email to the user with the reset URL
    await this.sendResetPasswordEmail(email, resetUrl)
    .catch(error => {throw new HttpException(error.message, 500)});
  }

  async storeResetToken(email: string, resetToken: string, expiration: number): Promise<void> {
    // Store the reset token and expiration in your database or temporary storage
    // Example code using a database query or an ORM (e.g., Prisma):
    await this.prisma.user.update({
      where: { email: email },
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

  async sendResetPasswordEmail(email: string, resetUrl: string): Promise<void> {
    const { sender } = this.emailTransporterConfig;
    const subject = 'Password Reset';
    const body = `Click on the following link to reset your password: ${resetUrl}`;
    const temp: string = '../templates/reset';

    // Use the configured transporter to send the email
    const context = {
      url: resetUrl,
    };

    await this.mailService.sendEmail(email, subject, temp, context);
  }

  // private getEmailService(provider: string): EmailService {
  //   // Implement logic to get the appropriate email service based on the provider
  //   // This could involve using conditional statements or a factory pattern

  //   // Example: Using Nodemailer as the email service
  //   if (provider === 'nodemailer') {
  //     return new NodemailerEmailService();
  //   }

  //   // Add other email service providers as needed

  //   throw new Error(`Unsupported email service provider: ${provider}`);
  // }

  private isPasswordStrong(password: string): boolean {
    // Password strength requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~`]/.test(password);
    const isLengthValid = password.length >= 8;

    return hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter && isLengthValid;
  }

}
