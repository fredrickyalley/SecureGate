
export interface JwtConfig {
  secret: string;
  expiresIn: string;
}
export interface AuthConfigure {
  // Other authentication-related configuration properties...

  forgotPassword: {
    // Configuration options for the "Forgot Password" functionality
    resetPasswordUrl: string; // The URL where users will be redirected to reset their password
    resetPasswordExpiration: number; // The expiration time (in milliseconds) for the reset token
    // Other configuration options as needed...
  };

  email: {
    sender: string; // Email address of the sender
    provider: string; // Name or type of the email service provider
    // Other email configuration options...
  };

  emailTransporter: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    sender: string; // Email address of the sender
  }


  // jwt: {
  //   jwt: JwtConfig;
  // }
}

export interface AuthConfig {
  jwt: JwtConfig;

 
  // Add any other configuration properties as needed
}

export interface TokenPayload {
  username: string;
  sub: number;
}
