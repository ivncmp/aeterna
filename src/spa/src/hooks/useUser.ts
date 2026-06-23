import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { api } from "@/lib/api";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => api.get<User>("/auth/me"),
    staleTime: Infinity,
  });
}
