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
  return useQuery<AuthResponse | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: 0, // Always fetch fresh data for auth state
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/login", data);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      return response.json();
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
