import KMU_LOGO from "../assets/logo/KMU_LOGO.tsx";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import WeekCard from "../cards/WeekCard.tsx";
import getNext7Days from "./getNext7Days.ts";
import StockAutoSlider, { type Stock } from "./StockAutoSlider.tsx";
import PosterCarousel, {
  PosterCarouselSkeleton,
  type PosterItem,
} from "./PosterCarousel.tsx";

import { normalizeSchedules, type ScheduleMap } from "../utils/schedule";
import { type DisplayResponse, getDisplay } from "../api/display.ts";
import { displayNameForItem } from "../utils/displayName.ts";
import { SkeletonText } from "../components/Skeleton.tsx";
import { useNow } from "../hooks/useNow.ts";

// "src/assets/..." 문자열 경로는 dev 서버에서만 동작하고 build 후엔 404라서 import로 변경
import poster1 from "../assets/poster/poster1.jpeg";
import poster2 from "../assets/poster/poster2.jpeg";
import poster3 from "../assets/poster/poster3.jpeg";

const TEN_MIN = 10 * 60 * 1000;
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const SECTION_TITLE = "text-white text-8xl font-semibold";

const FALLBACK_POSTERS: PosterItem[] = [
  { posterId: "local-1", imageUrl: poster1 },
  { posterId: "local-2", imageUrl: poster2 },
  { posterId: "local-3", imageUrl: poster3 },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * 시계만 따로 분리 — 분이 바뀔 때 이 컴포넌트만 리렌더된다.
 * (예전엔 Display 전체가 1초마다 리렌더되면서 포스터/재고/학사일정까지 매초 다시 그렸음)
 */
function HeaderClock({ loading }: { loading: boolean }) {
  const now = useNow("minute");

  return (
    <div className="flex flex-col items-end gap-3">
      <SkeletonText loading={loading}>
        <div className="text-white text-7xl font-semibold">
          {now.getMonth() + 1}월 {now.getDate()}일 ({WEEK[now.getDay()]})
        </div>
      </SkeletonText>
      <SkeletonText loading={loading} rounded="rounded-[40px]">
        <div className="text-white text-[240px] font-semibold leading-none">
          {pad2(now.getHours())}:{pad2(now.getMinutes())}
        </div>
      </SkeletonText>
    </div>
  );
}

export default function Display() {
  // 날짜가 바뀔 때만 리렌더 (학사 일정 / "N월 학사 일정" 용)
  const today = useNow("day");
  const todayMonth = today.getMonth() + 1;

  const { data, isLoading, isError, error } = useQuery<DisplayResponse>({
    queryKey: ["display"],
    queryFn: getDisplay,
    staleTime: TEN_MIN,
    refetchInterval: TEN_MIN,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const scheduleMap: ScheduleMap = useMemo(() => {
    if (!data?.schedules) return {};
    return normalizeSchedules(data.schedules);
  }, [data?.schedules]);

  const stocks: Stock[] = useMemo(() => {
    if (!data?.items) return [];
    return data.items
      .map((it) => ({
        title: displayNameForItem(it.itemName),
        leftNum: it.count,
        imageUrl: it.imageUrl,
      }))
      .filter((x) => x.leftNum > 0);
  }, [data?.items]);

  const posters: PosterItem[] = useMemo(() => {
    const list = data?.posters ?? [];
    return list.length > 0 ? list : FALLBACK_POSTERS;
  }, [data?.posters]);

  const weekDays = useMemo(
    () => getNext7Days(scheduleMap, today),
    [scheduleMap, today],
  );

  useEffect(() => {
    if (isError) console.error("getDisplay error:", error);
  }, [isError, error]);

  return (
    <div className="w-full min-h-screen px-40 py-36 bg-gradient-to-l from-neutral-900 to-[#034E9D] flex justify-center items-center">
      <div className="w-[2703px] flex flex-col gap-20">
        {/* 헤더 */}
        <div className="w-full flex justify-between items-start">
          <div className="flex items-center gap-12">
            <div className="w-60 h-60 relative overflow-hidden">
              <KMU_LOGO />
            </div>

            <div className="w-[1292px] flex flex-col gap-10">
              <SkeletonText loading={isLoading}>
                <div className="text-white text-8xl font-semibold">
                  국민대학교 | 소프트웨어융합대학
                </div>
              </SkeletonText>
              <SkeletonText loading={isLoading}>
                <div className="text-white text-7xl font-bold">
                  제 10대 학생회 ECHO
                </div>
              </SkeletonText>
            </div>
          </div>

          <HeaderClock loading={isLoading} />
        </div>

        <div className="flex flex-col items-center gap-40">
          {/* 행사 안내 */}
          <div className="w-full flex flex-col gap-14">
            <SkeletonText loading={isLoading}>
              <div className={SECTION_TITLE}>행사 안내</div>
            </SkeletonText>

            <div className="w-full px-12 py-20 bg-white/10 rounded-[50px] flex justify-center items-center">
              <div className="w-full">
                {isLoading ? (
                  <PosterCarouselSkeleton />
                ) : (
                  <PosterCarousel
                    posters={posters}
                    intervalMs={4000}
                    animMs={1500}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 학사 일정 */}
          <div className="w-full flex flex-col gap-14">
            <SkeletonText loading={isLoading}>
              <div className={SECTION_TITLE}>{todayMonth}월 학사 일정</div>
            </SkeletonText>

            <div className="w-full px-12 py-20 bg-white/20 rounded-[50px] flex justify-center items-center gap-10">
              {weekDays.map((item) => (
                <WeekCard
                  key={item.key}
                  year={item.year}
                  month={item.month}
                  day={item.day}
                  events={item.events}
                  isToday={item.isToday}
                  loading={isLoading}
                />
              ))}
            </div>
          </div>

          {/* 재고 */}
          <div className="w-full flex flex-col gap-14">
            <SkeletonText loading={isLoading}>
              <div className={SECTION_TITLE}>복지물품 재고 현황</div>
            </SkeletonText>

            <StockAutoSlider stocks={stocks} loading={isLoading} />
          </div>

          {/* 안내사항 */}
          <div className="w-full flex flex-col gap-14">
            <SkeletonText loading={isLoading}>
              <div className={SECTION_TITLE}>안내사항</div>
            </SkeletonText>

            <div className="w-full px-12 py-20 bg-white/10 rounded-[50px] flex justify-between items-stretch gap-14">
              {/* 왼쪽 */}
              <div className="flex-1 flex flex-col gap-10">
                <SkeletonText
                  loading={isLoading}
                  className="w-full"
                  rounded="rounded-[30px]"
                >
                  <div className="w-full px-12 py-10 bg-white/10 rounded-[30px] flex flex-col gap-10">
                    <div className="flex justify-between items-center">
                      <div className="text-white text-7xl font-medium">
                        복지물품 대여 시간
                      </div>
                      <div className="text-white text-6xl font-medium">
                        10:00 ~ 17:00
                      </div>
                    </div>

                    <div className="text-white w-full text-5xl font-medium text-right">
                      점심시간 (12:00~13:00) 제외
                    </div>
                  </div>
                </SkeletonText>

                <SkeletonText
                  loading={isLoading}
                  className="w-full"
                  rounded="rounded-[30px]"
                >
                  <div className="w-full px-12 py-10 bg-white/10 rounded-[30px] flex justify-between items-center">
                    <div className="text-white text-6xl font-medium">
                      소프트웨어융합대학 교학팀
                    </div>
                    <div className="text-white text-6xl font-medium">
                      02-910-5047
                    </div>
                  </div>
                </SkeletonText>
              </div>

              {/* 오른쪽 */}
              <div className="flex flex-shrink-0 items-center gap-14">
                <SkeletonText loading={isLoading} rounded="rounded-[50px]">
                  <div className="w-[554px] h-[718px] px-12 py-24 bg-white/10 rounded-[50px] flex flex-col justify-center items-center gap-20">
                    <div className="text-center text-white text-7xl font-medium">
                      빌릴게 접속
                      <br /> QR코드
                    </div>
                    <img
                      className="w-80 h-80"
                      src="/Billilge.svg"
                      alt="qr코드"
                    />
                  </div>
                </SkeletonText>

                <SkeletonText loading={isLoading} rounded="rounded-[50px]">
                  <div className="w-[554px] h-[718px] px-12 py-20 bg-white/10 rounded-[50px] flex flex-col justify-center items-center gap-20">
                    <div className="w-[454px] text-center text-white text-7xl font-medium [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                      학생회 오픈채팅
                      <br />
                      QR코드
                    </div>
                    <img
                      className="w-80 h-80"
                      src="/OpenChatting.svg"
                      alt="오픈채팅 qr"
                    />
                  </div>
                </SkeletonText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
