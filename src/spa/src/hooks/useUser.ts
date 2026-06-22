import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { mockUser } from "@/lib/mock";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User> => mockUser(),
    staleTime: Infinity,
  });
}
