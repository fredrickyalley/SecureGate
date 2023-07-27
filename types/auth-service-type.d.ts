
import * as nodemailer from 'nodemailer';
import {User} from './user-type'


    //  login.dto.ts
export class LoginDto {
email: string;
password: string;
}

// signup.dto.ts
export class SignupDto {
email: string;
password: string;
}






export interface TokenPayload {
email: string;
sub: number;
}

export interface OAuthProfile {
id: string;
// Add other properties from the OAuth profile if needed
}

export interface AuthConfigure {
forgotPassword: {
resetPasswordExpiration: number;
resetPasswordUrl: string;
};
emailTransporter: {
host: string;
port: number;
secure: boolean;
auth: {
  user: string;
  pass: string;
};
};
// Add other configurations if needed
}

export class SecureAuthService {
constructor();
validateTokenPayload(payload: TokenPayload): Promise<User>;
findOrCreateUserFromOAuthProfile(profile: OAuthProfile): Promise<User>;
login(loginDto: LoginDto): Promise<{ access_token: string }>;
signup(email: string, password: string): Promise<User>;
resetPassword(email: string, newPassword: string): Promise<User>;
forgotPassword(email: string): Promise<void>;
storeResetToken(email: string, resetToken: string, expiration: number): Promise<void>;
sendResetPasswordEmail(email: string, resetUrl: string): Promise<void>;
private createTransporter(): nodemailer.Transporter;
private generateRandomString(length: number): string;
private isPasswordStrong(password: string): boolean;
}

