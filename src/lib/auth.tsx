import React, { useEffect, memo } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  type User, 
  type AuthState, 
  STORAGE_KEY, 
  validateCredentials 
} from "./auth/types";
import { authAtom } from "./auth/auth-context";

// Custom hook for auth functionality
export const useAuth = () => {
  const [auth, setAuth] = useAtom<AuthState>(authAtom);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Persist auth state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const isAuthenticated = () => {
    return !!auth.token;
  };

  const updateAuthState = (newState: Partial<AuthState>) => {
    setAuth(currentState => ({
      ...currentState,
      ...newState
    }));
  };

  const signIn = async (email: string, password: string) => {
    try {
      updateAuthState({ loading: true });
      
      // Validate credentials even in development
      validateCredentials(email, password);
      
      // In development, only allow sign in with test credentials
      if (email !== 'test@example.com' || password !== 'password123') {
        throw new Error('Invalid credentials');
      }
      
      const user: User = {
        id: "dev-user",
        email,
        name: "Development User",
      };
      const token = "dev-token";
      
      const newState: AuthState = {
        user,
        token,
        loading: false
      };
      setAuth(newState);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate("/dashboard");
      return { user, token };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in";
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
      updateAuthState({ loading: false });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      updateAuthState({ loading: true });
      
      // Validate credentials
      validateCredentials(email, password);
      
      // Additional signup validations
      if (!name || name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      
      // In development, prevent duplicate emails
      if (email === 'test@example.com') {
        throw new Error('Email already in use');
      }
      
      const user: User = {
        id: "dev-user",
        email,
        name,
      };
      const token = "dev-token";
      
      const newState: AuthState = {
        user,
        token,
        loading: false
      };
      setAuth(newState);
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      
      navigate("/dashboard");
      return { user, token };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create account";
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive",
      });
      updateAuthState({ loading: false });
      throw error;
    }
  };

  const signOut = () => {
    try {
      const newState: AuthState = {
        user: null,
        token: null,
        loading: false
      };
      setAuth(newState);
      localStorage.removeItem(STORAGE_KEY);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: "Sign out failed",
        description: "Failed to sign out properly.",
        variant: "destructive",
      });
    }
  };

  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
};

// Protected Route Component
export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated() ? <>{children}</> : null;
});
