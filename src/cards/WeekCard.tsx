import { memo } from "react";
import { SkeletonLine, SkeletonText } from "../components/Skeleton.tsx";

interface WeekCardProps {
  year: number;
  month: number; // 1~12
  day: number; // 날짜
  events: string[];
  isToday?: boolean;
  loading?: boolean;
}

const EVENT_TEXT = "text-4xl font-medium";

function WeekCard({
  year,
  month,
  day,
  events,
  isToday = false,
  loading = false,
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
      className={`inline-flex h-96 w-80 flex-col gap-8 rounded-[50px] p-7
        ${isToday ? "bg-white/20" : "bg-white/10"}
      `}
    >
      {/* 날짜 */}
      <SkeletonText loading={loading}>
        <div className={`text-6xl font-bold ${dayColor}`}>{day}</div>
      </SkeletonText>

      {/* 이벤트 */}
      <div className="flex flex-col gap-1 overflow-hidden">
        {loading
          ? [0, 1].map((i) => (
              // 실제 이벤트 한 줄(leading-[80px])과 같은 높이의 칸 안에 글자 높이만큼 막대
              <div key={i} className="flex h-[80px] items-center">
                <SkeletonLine
                  className={`${EVENT_TEXT} w-[85%]`}
                  rounded="rounded-xl"
                />
              </div>
            ))
          : events.map((event, idx) => (
              <div
                key={idx}
                className={`${EVENT_TEXT} text-white leading-[80px] truncate w-full`}
              >
                {event}
              </div>
            ))}
      </div>
    </div>
  );
}

export default memo(WeekCard);
