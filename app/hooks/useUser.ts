import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}

export function useUser() {
  return useQuery<{ user: User }>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        if (res.status === 401) return null; // Not logged in
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
