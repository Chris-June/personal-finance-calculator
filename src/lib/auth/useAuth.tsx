import { useEffect } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { type AuthState, STORAGE_KEY } from "./types";
import { authAtom } from "./auth-context";

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
    setAuth(currentState => {
      const updatedState = {
        ...currentState,
        ...newState
      };
      
      // Show relevant toast notifications based on auth state changes
      if (!currentState.token && updatedState.token) {
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
          variant: "default",
        });
        navigate("/dashboard"); // Redirect to dashboard after login
      } else if (currentState.token && !updatedState.token) {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
          variant: "default",
        });
        navigate("/login"); // Redirect to login page after logout
      } else if (updatedState.error) {
        toast({
          title: "Authentication Error",
          description: updatedState.error,
          variant: "destructive",
        });
      }
      
      return updatedState;
    });
  };

  return {
    auth,
    isAuthenticated,
    updateAuthState,
    loading: auth.loading
  };
};
