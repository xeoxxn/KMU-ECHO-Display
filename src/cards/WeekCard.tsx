interface WeekCardProps {
  year: number;
  month: number; // 1~12
  day: number; // 날짜
  events: string[];
  isToday?: boolean;
}

export default function WeekCard({
  year,
  month,
  day,
  events,
  isToday = false,
}: WeekCardProps) {
  // 요일 계산 (0:일 ~ 6:토)
  const dayOfWeek = new Date(year, month - 1, day).getDay();

  const dayColor =
    dayOfWeek === 0
      ? "text-red-400" // 일요일
      : dayOfWeek === 6
        ? "text-blue-400" // 토요일
        : "text-white"; // 평일

  return (
    <div
      className={`inline-flex h-96 w-80 flex-col gap-12 rounded-[50px] p-7
        ${isToday ? "bg-white/20" : "bg-white/10"}
      `}
    >
      {/* 날짜 */}
      <div className={`text-6xl font-bold ${dayColor}`}>{day}</div>

      {/* 이벤트 */}
      <div className="flex flex-col gap-1 overflow-hidden">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="text-white text-4xl font-medium leading-[80px]"
          >
            {event}
          </div>
        ))}
      </div>
    </div>
  );
}
