// src/queries/useDisplayStatic.ts
import { useQuery } from "@tanstack/react-query";
import { getDisplay } from "../api/display";

export function useDisplayStatic() {
  return useQuery({
    queryKey: ["display", "static"],
    queryFn: getDisplay,
    staleTime: 30 * 60_000, // 30분은 신선(원하면 Infinity)
    gcTime: 60 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
