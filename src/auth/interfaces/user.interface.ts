import { Role } from "@prisma/client";

// export interface User {
//     id: number;
//     email: string;
//     password: string;
//     roles: Role[];
//     // Add any additional properties you expect in the user interface
//   }

  export interface OAuthProfile {
    id: number; // The unique identifier provided by the OAuth provider (e.g., sub)

    // Add other relevant fields from the OAuth provider's response as needed
  }