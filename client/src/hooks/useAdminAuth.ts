import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export interface AdminAuthResponse {
  admin: AdminUser;
}

export interface AdminLoginData {
  username: string;
  password: string;
}

export function useAdminAuth() {
  const queryClient = useQueryClient();

  const { data: admin, isLoading } = useQuery({
    queryKey: ['/api/admin/me'],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: AdminLoginData) => {
      return await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/me'] });
    },
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}