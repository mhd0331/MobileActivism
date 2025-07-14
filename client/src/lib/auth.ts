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
  });
  
  console.log("useAuth query result:", { data: query.data, isLoading: query.isLoading, error: query.error });
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
    onSuccess: () => {
      // Force invalidate and refetch user data immediately
      queryClient.removeQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/signatures/check"] });
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] });
      // Force immediate refetch of auth state
      queryClient.refetchQueries({ queryKey: ["/api/me"] });
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
