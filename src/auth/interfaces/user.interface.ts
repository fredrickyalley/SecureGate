export interface User {
    id: number;
    username: string;
    password: string;
    roles: string[];
    // Add any additional properties you expect in the user interface
  }

  export interface OAuthProfile {
    id: number; // The unique identifier provided by the OAuth provider (e.g., sub)
    username: string; // The user's email address
    password: string; // Optional: First name of the user
    roles: string[]; // Optional: Last name of the user
    // Add other relevant fields from the OAuth provider's response as needed
  }