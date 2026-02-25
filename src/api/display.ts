// src/api/display.ts
import { api } from "./instance";

export type DisplayResponse = {
  posters: { posterId: number; title: string; imageUrl: string }[];
  schedules: Record<string, string[]>[];
  items: { itemName: string; count: number; imageUrl: string }[];
};

export async function getDisplay() {
  const { data } = await api.get<DisplayResponse>("/display");
  return data;
}
