export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error?: string;
}

export const STORAGE_KEY = "auth_state";

// Initialize auth state from storage or use default
export const getInitialState = (): AuthState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored auth state:", e);
    }
  }
  
  // Default state for development
  return {
    user: {
      id: "dev-user",
      email: "test@example.com",
      name: "Development User",
    },
    token: "dev-token",
    loading: false,
  };
};

export const validateCredentials = (email: string, password: string) => {
  // Basic validation for development
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};
