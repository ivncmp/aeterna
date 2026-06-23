import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";
import { api } from "@/lib/api";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => api.get<User>("/auth/me"),
    staleTime: Infinity,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<User, "id" | "email" | "created_at" | "updated_at">>) =>
      api.put<User>("/auth/profile", data),
    onSuccess: (user) => {
      qc.setQueryData(["user"], user);
    },
  });
}
