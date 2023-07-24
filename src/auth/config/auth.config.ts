import { ConfigService } from "@nestjs/config";

export default () => ({
    // Other authentication-related configuration...
  
    forgotPassword: {
      resetPasswordUrl: process.env.RESET_PASSWORD_URL, // Provide the actual URL here
      resetPasswordExpiration: parseInt(process.env.RESET_PASSWORD_EXPIRATION, 10), // Provide the expiration time here
      // Other configuration options as needed...
    },

    emailTransporter: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'false',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      sender: process.env.EMAIL_SENDER,
    },

    jwt: {
          secret: process.env.JWT_SECRET || 'my-secret-key',
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
          // Other JWT-related configuration options
        },

  });
  

//   import { registerAs } from '@nestjs/config';

//   export const authConfig = registerAs('auth', () => ({
//   email: {
//     sender: process.env.EMAIL_SENDER || 'noreply@example.com',
//     // Other email-related configuration options
//   },
//   jwt: {
//     secret: process.env.JWT_SECRET || 'my-secret-key',
//     expiresIn: process.env.JWT_EXPIRES_IN || '1d',
//     // Other JWT-related configuration options
//   },
//   forgetPassword: {
//     expirationTime: parseInt(process.env.FORGET_PASSWORD_EXPIRATION_TIME) || 24 * 60 * 60 * 1000, // Default: 24 hours
//     // Other forget password-related configuration options
//   },
//   prisma: {
//     // Prisma-specific configuration options
//   },
//   // Add other user preference-based configuration options
// }));

