export interface AuthResponse {
    token: string;
    message: string;
    [key: string]: any; // Allows additional properties if needed
  }
  