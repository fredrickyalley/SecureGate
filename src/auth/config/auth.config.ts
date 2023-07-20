import { ConfigService } from "@nestjs/config";

export default (config: ConfigService) => ({
    // Other authentication-related configuration...
  
    forgotPassword: {
      resetPasswordUrl: config.get('RESET_PASSWORD_URL'), // Provide the actual URL here
      resetPasswordExpiration: parseInt(config.get("RESET_PASSWORD_EXPIRATION"), 10), // Provide the expiration time here
      // Other configuration options as needed...
    },

    emailTransporter: {
      host: config.get("EMAIL_HOST"),
      port: parseInt(config.get("EMAIL_PORT"), 10),
      secure: config.get("EMAIL_SECURE") === 'true',
      auth: {
        user: config.get("EMAIL_USERNAME"),
        pass: config.get("EMAIL_PASSWORD"),
      },
      sender: config.get("EMAIL_SENDER"),
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
