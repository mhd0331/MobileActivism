import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  name: string;
  phone: string;
  district: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginData {
  name: string;
  phone: string;
  district: string;
}

export function useAuth() {
  const query = useQuery<AuthResponse | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: 0, // Always fetch fresh data for auth state
    gcTime: 0, // Don't cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  console.log("useAuth query result:", { data: query.data, isLoading: query.isLoading, error: query.error, cookies: document.cookie });
  return query;
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginData) => {
      console.log("Login attempt with data:", data);
      const response = await apiRequest("POST", "/api/login", data);
      console.log("Login response status:", response.status);
      console.log("Login response headers:", response.headers);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      const result = await response.json();
      console.log("Login successful, result:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Login onSuccess triggered with data:", data);
      // Force invalidate and refetch user data immediately
      queryClient.removeQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/signatures/check"] });
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] });
      
      // Force complete cookie reset and browser refresh
      if (data.sessionId) {
        console.log("Login successful with session ID:", data.sessionId);
        
        // Clear ALL cookies for this domain
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Wait briefly and reload page to ensure clean state
        setTimeout(() => {
          console.log("Reloading page for fresh session...");
          window.location.reload();
        }, 100);
      }
      
      // Immediate and aggressive refetch of auth state
      console.log("Immediately refetching auth state...");
      queryClient.refetchQueries({ queryKey: ["/api/me"] });
      
      // Also try multiple times to ensure success
      setTimeout(async () => {
        console.log("Refetching auth queries after login (attempt 1)...");
        console.log("Current cookies:", document.cookie);
        const result = await queryClient.fetchQuery({ queryKey: ["/api/me"] });
        console.log("Auth refetch result (attempt 1):", result);
        if (!result) {
          console.warn("Auth refetch failed, trying again...");
          setTimeout(async () => {
            const retryResult = await queryClient.fetchQuery({ queryKey: ["/api/me"] });
            console.log("Auth retry result (attempt 2):", retryResult);
          }, 1000);
        }
      }, 100);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    },
  });
}
