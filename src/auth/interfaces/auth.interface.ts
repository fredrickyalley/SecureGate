
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


  jwt: {
    jwt: JwtConfig;
  }
}

export interface AuthConfig {
  jwt: JwtConfig;
 
}

export interface TokenPayload {
  username: string;
  sub: number;
}
