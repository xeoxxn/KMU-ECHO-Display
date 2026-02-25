// src/queries/useStockItems.ts
import { useQuery } from "@tanstack/react-query";
import { getDisplay } from "../api/display";

const STOCK_REFRESH_MS = 30 * 60 * 1000; // 30분마다 재고 갱신

export function useStockItems() {
  return useQuery({
    queryKey: ["display", "items"],
    queryFn: async () => {
      const data = await getDisplay();
      return data.items;
    },
    staleTime: 0,
    refetchInterval: STOCK_REFRESH_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });
}
