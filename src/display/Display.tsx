import KMU_LOGO from "../assets/logo/KMU_LOGO.tsx";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import WeekCard from "../cards/WeekCard.tsx";
import getNext7Days from "./getNext7Days.ts";
import StockAutoSlider from "./StockAutoSlider.tsx";

import { normalizeSchedules, type ScheduleMap } from "../utils/schedule";
import { type DisplayResponse, getDisplay } from "../api/display.ts";
import { displayNameForItem } from "../utils/displayName.ts";
import PosterCarousel from "./PosterCarousel.tsx";

type Stock = { title: string; leftNum: number; imageUrl?: string };

const TEN_MIN = 10 * 60 * 1000;

export default function Display() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const dayofWeek = week[now.getDay()];
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const { data, isError, error, isLoading } = useQuery<DisplayResponse>({
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

  const posters = useMemo(() => data?.posters ?? [], [data?.posters]);

  const weekDays = useMemo(
    () => getNext7Days(scheduleMap, now),
    [scheduleMap, now],
  );

  useEffect(() => {
    if (isError) console.error("getDisplay error:", error);
  }, [isError, error]);
  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-40 py-36 bg-gradient-to-l from-neutral-900 to-[#034E9D] flex justify-center items-center">
        <div className="w-[2703px] flex flex-col gap-20 animate-pulse">
          <div className="h-32 w-1/3 bg-white/20 rounded-xl" />

          <div className="h-[600px] bg-white/10 rounded-[50px]" />

          <div className="flex gap-10">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[250px] bg-white/10 rounded-3xl"
              />
            ))}
          </div>

          <div className="h-[300px] bg-white/10 rounded-[50px]" />
        </div>
      </div>
    );
  }
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
              <div className="text-white text-8xl font-semibold">
                국민대학교 | 소프트웨어융합대학
              </div>
              <div className="text-white text-7xl font-bold">
                제 10대 학생회 ECHO
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-white text-7xl font-semibold">
              {todayMonth}월 {todayDay}일 ({dayofWeek})
            </div>
            <div className="text-white text-[240px] font-semibold leading-none">
              {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-40">
          {/* 행사 안내 */}
          <div className="w-full flex flex-col gap-14">
            <div className="text-white text-8xl font-semibold">행사 안내</div>

            <div className="w-full px-12 py-20 bg-white/10 rounded-[50px] flex justify-center items-center">
              <div className="w-full">
                <PosterCarousel
                  posters={
                    posters.length > 0
                      ? posters
                      : [
                          {
                            posterId: "local-1",
                            imageUrl: "src/assets/poster/poster1.jpeg",
                          },
                          {
                            posterId: "local-2",
                            imageUrl: "src/assets/poster/poster2.jpeg",
                          },
                          {
                            posterId: "local-3",
                            imageUrl: "src/assets/poster/poster3.jpeg",
                          },
                        ]
                  }
                  intervalMs={4000}
                  animMs={1500}
                />
              </div>
            </div>
          </div>

          {/* 학사 일정 */}
          <div className="w-full flex flex-col gap-14">
            <div className="text-white text-8xl font-semibold">
              {todayMonth}월 학사 일정
            </div>

            <div className="w-full px-12 py-20 bg-white/20 rounded-[50px] flex justify-center items-center gap-10">
              {weekDays.map((item) => (
                <WeekCard
                  key={item.key}
                  year={item.year}
                  month={item.month}
                  day={item.day}
                  events={item.events}
                  isToday={item.isToday}
                />
              ))}
            </div>
          </div>

          {/* 재고 */}
          <div className="w-full flex flex-col gap-14">
            <div className="text-white text-8xl font-semibold">
              복지물품 재고 현황
            </div>
            <StockAutoSlider stocks={stocks} />
          </div>

          {/* 안내사항 */}
          <div className="w-full flex flex-col gap-14">
            <div className="text-white text-8xl font-semibold">안내사항</div>

            <div className="w-full px-12 py-20 bg-white/10 rounded-[50px] flex justify-between items-stretch gap-14">
              {/* 왼쪽 */}
              <div className="flex-1 flex flex-col gap-10">
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

                <div className="w-full px-12 py-10 bg-white/10 rounded-[30px] flex justify-between items-center">
                  <div className="text-white text-6xl font-medium">
                    소프트웨어융합대학 교학팀
                  </div>
                  <div className="text-white text-6xl font-medium">
                    02-910-5047
                  </div>
                </div>
              </div>

              {/* 오른쪽 */}
              <div className="flex flex-shrink-0 items-center gap-14">
                <div className="w-[554px] h-[718px] px-12 py-24 bg-white/10 rounded-[50px] flex flex-col justify-center items-center gap-20">
                  <div className="text-center text-white text-7xl font-medium">
                    빌릴게 접속
                    <br /> QR코드
                  </div>
                  <img className="w-80 h-80" src="/Billilge.svg" alt="qr코드" />
                </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
