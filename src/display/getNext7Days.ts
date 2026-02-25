import type { ScheduleMap } from "../utils/schedule";

export type DayInfo = {
  year: number;
  month: number;
  day: number;
  key: string;
  events: string[];
  isToday: boolean;
  isSaturday: boolean;
  isSunday: boolean;
};

export default function getNext7Days(
  scheduleMap: ScheduleMap,
  today = new Date(),
): DayInfo[] {
  const days: DayInfo[] = [];

  for (let offset = -3; offset <= 3; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    days.push({
      year,
      month,
      day,
      key,
      events: scheduleMap[key] ?? [],
      isToday: offset === 0,
      isSaturday: dayOfWeek === 6,
      isSunday: dayOfWeek === 0,
    });
  }

  return days;
}
