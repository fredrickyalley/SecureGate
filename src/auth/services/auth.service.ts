import { Injectable, UnauthorizedException, HttpException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthConfigure, TokenPayload } from '../interfaces/auth.interface';
import { OAuthProfile } from '../interfaces/user.interface';
import { User } from '@prisma/client';
import { PrismaService } from '../prismaService/prisma.service';
import { ConfigService } from '@nestjs/config';
import {MailService} from '../mailer/mail.service';
import * as nodemailer from 'nodemailer';

/**
 * Injectable service that provides authentication-related functionalities, such as login, signup,
 * password reset, and token validation.
 *
 * @class
 * @name SecureAuthService
 */
@Injectable()
export class SecureAuthService {
   /**
   * Configuration object for the "Forgot Password" functionality.
   * @private
   */
  private readonly forgotPasswordConfig: AuthConfigure['forgotPassword'];

  /**
   * Configuration object for the email transporter used for sending emails.
   * @private
   */
  private readonly emailTransporterConfig: AuthConfigure['emailTransporter'];

  /**
   * Nodemailer transporter used to send emails.
   * @private
   */
  private transporter: nodemailer.Transporter;

  /**
   * Creates an instance of the SecureAuthService.
   *
   * @constructor
   * @param {PrismaService} prisma - Instance of the PrismaService to interact with the database.
   * @param {ConfigService<AuthConfigure>} configService - Instance of the ConfigService to access the authentication configuration.
   * @param {JwtService} jwtService - Instance of the JwtService to sign and verify JWT tokens.
   * @param {MailService} mailService - Instance of the MailService to send emails.
   */
  constructor( 
    private prisma: PrismaService, 
    private readonly configService: ConfigService<AuthConfigure>, 
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    ) {
    this.forgotPasswordConfig = this.configService.get('forgotPassword');
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

  /**
 * Validates the payload of a JWT token and retrieves the associated user from the database.
 *
 * @async
 * @param {TokenPayload} payload - The decoded payload of the JWT token.
 * @returns {Promise<User>} - The user associated with the payload if valid.
 * @throws {UnauthorizedException} - If the token is invalid or the user is not found.
 */

  async validateTokenPayload(payload: TokenPayload): Promise<User> {
    
    const user = await this.prisma.user.findUnique({where: {id: payload.sub}});
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

/**
 * Finds or creates a user based on the provided OAuth profile.
 *
 * @async
 * @param {OAuthProfile} profile - The OAuth profile of the user.
 * @returns {Promise<User>} - The existing or newly created user.
 * @throws {NotFoundException} - If the user is not found based on the OAuth profile.
 */
  // Change the type of the argument to `OAuthProfile`
async findOrCreateUserFromOAuthProfile(profile: OAuthProfile): Promise<User> {
  const existingUser = await this.prisma.user.findUnique({
    where: { id: profile.id }, // Assuming `id` is the primary key of the `User` model
  });

  if (!existingUser) {
    throw new NotFoundException('User not found');
  }

  return existingUser;
}

/**
 * Authenticates a user based on their email and password and returns an access token upon successful authentication.
 *
 * @async
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<{ access_token: string }>} - An object containing the access token.
 * @throws {UnauthorizedException} - If the email or password is invalid.
 */
  async login( email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findFirst({ where: { email: email, deletedAt: null } });
  
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // console.log(this.configService.get('jwt').secret)
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, {secret: this.configService.get('jwt').secret});
  
    return { access_token};
  }
  
  /**
 * Registers a new user with the provided email and password.
 *
 * @async
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Promise<User>} - The newly created user.
 * @throws {UnauthorizedException} - If the email is already associated with an existing user.
 */
  async signup(email: string, password: string): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });

    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      }
    });

    return newUser;
  }

  /**
 * Resets the password of a user based on the provided email and a new password.
 *
 * @async
 * @param {string} oldPassword - The email of the user.
 * @param {string} newPassword - The new password for the user.
 * @returns {Promise<User>} - The updated user object.
 * @throws {UnauthorizedException} - If the user is not found.
 */
  async resetPassword(userId: number, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const verifyPassword = await bcrypt.compare(oldPassword, user.password);
    
    if(!verifyPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword},
    });

    return updatedUser;
  }

/**
 * Initiates the "Forgot Password" flow for a user based on the provided email.
 *
 * @async
 * @param {string} email - The email of the user.
 * @returns {Promise<void>} - A promise that resolves once the reset password email is sent.
 * @throws {HttpException} - If an error occurs while sending the reset password email.
 */
  async forgotPassword(email: string): Promise<void> {
    // Generate a unique reset token
    const resetToken = this.generateRandomString(32);

    // Store the reset token in your database or temporary storage with an expiration time
    const resetTokenExpiration = Date.now() + this.forgotPasswordConfig.resetPasswordExpiration;
    await this.storeResetToken(email, resetToken, resetTokenExpiration);

    // Compose the reset URL with the reset token and expiration time
    const resetUrl = `${this.forgotPasswordConfig.resetPasswordUrl}?token=${resetToken}`;

    // Send the password reset email to the user with the reset URL
    await this.sendResetPasswordEmail(email, resetUrl)
    .catch(error => {throw new HttpException(error.message, 500)});
  }

  /**
 * Stores the reset token and its expiration time in the user's database record.
 *
 * @async
 * @param {string} email - The email of the user.
 * @param {string} resetToken - The reset token to store.
 * @param {number} expiration - The expiration time of the reset token.
 * @returns {Promise<void>} - A promise that resolves once the token is stored.
 */
  async storeResetToken(email: string, resetToken: string, expiration: number): Promise<void> {
    await this.prisma.user.update({
      where: { email: email },
      data: { resetToken, resetTokenExpiration: new Date(expiration) },
    });
  }

  public generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
 * Sends a reset password email to the user with a reset URL.
 *
 * @async
 * @param {string} email - The email of the user.
 * @param {string} resetUrl - The URL where the user can reset their password.
 * @returns {Promise<void>} - A promise that resolves once the email is sent.
 * @throws {HttpException} - If an error occurs while sending the email.
 */
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


  /**
 * Checks if a password meets the required strength criteria.
 *
 * @param {string} password - The password to check.
 * @returns {boolean} - `true` if the password is strong; otherwise, `false`.
 */
  public isPasswordStrong(password: string): boolean {
    // Password strength requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~`]/.test(password);
    const isLengthValid = password.length >= 8;

    return hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter && isLengthValid;
  }

}
