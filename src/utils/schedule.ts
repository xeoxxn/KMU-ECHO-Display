export type ScheduleMap = Record<string, string[]>;

export function normalizeSchedules(
  schedules: Record<string, string[]>[],
): ScheduleMap {
  return schedules.reduce<ScheduleMap>((acc, cur) => {
    const entry = Object.entries(cur)[0];
    if (!entry) return acc;
    const [date, events] = entry;
    acc[date] = events ?? [];
    return acc;
  }, {});
}
