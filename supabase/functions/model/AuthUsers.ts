export interface SupabaseAuthUser {
    id: string;                    // User ID (UUID)
    aud: string;                   // Audience of the JWT (typically 'authenticated')
    role: string;                  // User's role (e.g., 'authenticated')
    email: string | null;          // User's email, can be null
    email_verified: boolean;       // Indicates if the email is verified
    phone: string | null;          // User's phone number, can be null
    phone_verified: boolean;       // Indicates if the phone number is verified
    created_at: string;            // Timestamp when the user was created
    updated_at: string;            // Timestamp when the user was last updated
    last_sign_in_at: string | null; // Timestamp of the last sign-in, can be null
    user_metadata: UserMetadata;   // User's metadata (custom fields)
    app_metadata: AppMetadata;     // App-related metadata, usually includes roles and permissions
  }
  
  // Interface for user metadata
  export interface UserMetadata {
    first_name?: string;   // Example of a custom field
    last_name?: string;    // Example of a custom field
    // Add more custom fields if needed
  }
  
  // Interface for app metadata
  export interface AppMetadata {
    provider: string;      // Authentication provider (e.g., 'email', 'google')
    is_active: boolean;    // Whether the user is active or not
    roles: string[];       // Array of roles assigned to the user
  }