import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { WebContent, InsertWebContent } from "@shared/schema";

export function useWebContent(section?: string) {
  return useQuery({
    queryKey: ["/api/web-content", section],
    queryFn: () =>
      apiRequest(
        section ? `/api/web-content?section=${section}` : "/api/web-content"
      ),
    staleTime: 0, // Always fetch fresh data
    gcTime: 1000 * 60, // Keep in cache for 1 minute
  });
}

export function useWebContentByKey(section: string, key: string) {
  return useQuery({
    queryKey: ["/api/web-content", section, key],
    queryFn: () => apiRequest(`/api/web-content/${section}/${key}`),
    enabled: !!(section && key),
    retry: false,
    staleTime: 0, // Always fetch fresh data
    gcTime: 1000 * 60, // Keep in cache for 1 minute
  });
}

export function useCreateWebContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertWebContent) => {
      return await apiRequest("/api/admin/web-content", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate and refetch all web content queries
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return Array.isArray(query.queryKey) && 
                 query.queryKey[0] === "/api/web-content";
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && 
                 query.queryKey[0] === "/api/web-content";
        }
      });
    },
  });
}

export function useUpdateWebContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWebContent> }) => {
      return await apiRequest(`/api/admin/web-content/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate all web content queries to ensure fresh data everywhere
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return Array.isArray(query.queryKey) && 
                 query.queryKey[0] === "/api/web-content";
        }
      });
      // Force refetch for all web content queries
      queryClient.refetchQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && 
                 query.queryKey[0] === "/api/web-content";
        }
      });
    },
  });
}

export function useDeleteWebContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/web-content/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      // Invalidate and refetch all web content queries
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return Array.isArray(query.queryKey) && 
                 query.queryKey[0] === "/api/web-content";
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && 
                 query.queryKey[0] === "/api/web-content";
        }
      });
    },
  });
}

// Helper hook for getting specific content by key
export function useContentText(section: string, key: string, fallback: string = "") {
  const { data, isLoading, error } = useWebContentByKey(section, key);
  
  if (isLoading || error) return fallback;
  return data?.content?.content || fallback;
}