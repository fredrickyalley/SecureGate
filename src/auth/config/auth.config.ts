
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
          expiresIn: process.env.JWT_EXPIRES_IN || '1h',
          // Other JWT-related configuration options
        },

  });
  



