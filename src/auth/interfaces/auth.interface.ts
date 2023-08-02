
/**
 * Interface representing the configuration for JSON Web Token (JWT) authentication.
 */
export interface JwtConfig {
  /**
   * The secret key used for signing and verifying JWT tokens.
   */
  secret: string;
  
  /**
   * The expiration time for JWT tokens.
   */
  expiresIn: string;
}

/**
 * Interface representing the configuration options for authentication.
 */
export interface AuthConfigure {
  // Other authentication-related configuration properties...

  /**
   * Configuration options for the "Forgot Password" functionality.
   */
  forgotPassword: {
    /**
     * The URL where users will be redirected to reset their password.
     */
    resetPasswordUrl: string;
    
    /**
     * The expiration time (in milliseconds) for the reset token.
     */
    resetPasswordExpiration: number;
    // Other configuration options as needed...
  };

  /**
   * Configuration options for the email transporter used for sending emails.
   */
  emailTransporter: {
    /**
     * The hostname of the email server.
     */
    host: string;
    
    /**
     * The port number of the email server.
     */
    port: number;
    
    /**
     * A boolean indicating if the connection to the email server should use SSL/TLS.
     */
    secure: boolean;
    
    /**
     * Authentication credentials for the email server.
     */
    auth: {
      /**
       * The username used for authenticating with the email server.
       */
      user: string;
      
      /**
       * The password used for authenticating with the email server.
       */
      pass: string;
    };
    
    /**
     * The email address of the sender.
     */
    sender: string;
  };

  /**
   * Configuration options for JSON Web Token (JWT) authentication.
   */
  jwt: {
    /**
     * The JWT configuration options.
     */
    jwt: JwtConfig;
  };
}

/**
 * Interface representing the configuration options for authentication, specifically JSON Web Token (JWT) authentication.
 */
export interface AuthConfig {
  /**
   * The JWT configuration options.
   */
  jwt: JwtConfig;
}

/**
 * Interface representing the payload of a JSON Web Token (JWT).
 */
export interface TokenPayload {
  /**
   * The email associated with the token.
   */
  email: string;
  
  /**
   * The subject of the token, typically representing the user's ID.
   */
  sub: number;
}
