import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useCurrentUser() {
  const { data: user, isLoading, error } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ["user"],
    retry: false, // Don't retry on auth errors
    staleTime: 0, // Always fetch fresh data to avoid weird cache persistence issues
    // Don't throw errors if backend is not available - just return null user
    throwOnError: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error
  };
}
