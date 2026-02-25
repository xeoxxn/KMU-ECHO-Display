import KMU_LOGO from "../assets/logo/KMU_LOGO.tsx";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import WeekCard from "../cards/WeekCard.tsx";
import getNext7Days from "./getNext7Days.ts";
import StockAutoSlider from "./StockAutoSlider.tsx";

import { normalizeSchedules, type ScheduleMap } from "../utils/schedule";
import { type DisplayResponse, getDisplay } from "../api/display.ts";
import { displayNameForItem } from "../utils/displayName.ts";

type Stock = { title: string; leftNum: number; imageUrl?: string };

const THIRTY_MIN = 30 * 60 * 1000;

export default function Display() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();

    const timer = setInterval(tick, 60_000); // ✅ 1분마다
    return () => clearInterval(timer);
  }, []);

  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const dayofWeek = week[now.getDay()];
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const { data, isError, error } = useQuery<DisplayResponse>({
    queryKey: ["display"],
    queryFn: getDisplay,
    staleTime: THIRTY_MIN,
    refetchInterval: THIRTY_MIN,
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

  return (
    <div className="w-full min-h-screen px-40 py-36 bg-gradient-to-l from-neutral-900 to-green-900 inline-flex flex-col justify-center items-center gap-36">
      <div className="flex flex-col justify-start items-start gap-20">
        {/* 헤더 */}
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="flex justify-start items-center gap-12">
            <div className="w-60 h-60 relative overflow-hidden">
              <KMU_LOGO />
            </div>
            <div className="w-[1292px] inline-flex flex-col justify-start items-start gap-10">
              <div className="self-stretch justify-start text-white text-8xl font-semibold ">
                국민대학교 | 소프트웨어융합대학
              </div>
              <div className="self-stretch justify-start text-white text-7xl font-bold ">
                제 10대 학생회 ECHO
              </div>
            </div>
          </div>

          <div className="inline-flex flex-col justify-center items-end gap-3">
            <div className="justify-start text-white text-7xl font-semibold ">
              {todayMonth}월 {todayDay}일 ({dayofWeek})
            </div>
            <div className="justify-start text-white text-[240px] font-semibold ">
              {hours}:{String(minutes).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* 행사 안내 (포스터) */}
        <div className="self-stretch flex flex-col justify-start items-start gap-14">
          <div className="w-109 justify-start text-white text-8xl font-semibold ">
            행사 안내
          </div>

          <div className="self-stretch px-24 py-28 bg-white/10 rounded-[50px] inline-flex justify-center items-center gap-20">
            {posters.length > 0 ? (
              posters
                .slice(0, 3)
                .map((p) => (
                  <img
                    key={p.posterId}
                    className="w-[742px] h-[1005px] object-cover opacity-90"
                    src={p.imageUrl}
                    alt={p.title}
                  />
                ))
            ) : (
              <>
                <img
                  className="w-[742px] h-[1005px] object-cover opacity-50"
                  src="src/assets/poster/poster1.jpeg"
                />
                <img
                  className="w-[859px] h-[1163px] object-cover"
                  src="src/assets/poster/poster2.jpeg"
                />
                <img
                  className="w-[742px] h-[1005px] object-cover opacity-50"
                  src="src/assets/poster/poster3.jpeg"
                />
              </>
            )}
          </div>
        </div>

        {/* 학사 일정 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-14">
          <div className="justify-start text-white text-8xl font-semibold ">
            {todayMonth}월 학사 일정
          </div>

          <div className="self-stretch px-12 py-20 bg-white/20 rounded-[50px] inline-flex justify-center items-center gap-10">
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
        <div className="w-[2703px] flex flex-col justify-start items-start gap-14">
          <div className="p-2.5 inline-flex justify-center items-center gap-2.5">
            <div className="justify-start text-white text-8xl font-semibold ">
              복지물품 재고 현황
            </div>
          </div>

          <StockAutoSlider stocks={stocks} />
        </div>

        {/* 안내사항 */}
        <div className="w-[2703px] flex flex-col justify-start items-start gap-14">
          <div className="p-2.5 inline-flex justify-center items-center gap-2.5">
            <div className="justify-start text-white text-8xl font-semibold">
              안내사항
            </div>
          </div>

          <div className="self-stretch px-28 py-14 bg-white/10 rounded-[50px] inline-flex justify-between items-center">
            <div className="w-[1168px] inline-flex flex-col justify-start items-start gap-10">
              <div className="self-stretch px-12 py-10 bg-white/10 rounded-[30px] inline-flex justify-between items-center">
                <div className="justify-start text-white text-7xl font-medium">
                  복지물품 대여 시간
                </div>
                <div className="justify-start text-white text-6xl font-medium">
                  14:00 ~ 18:00
                </div>
              </div>

              <div className="self-stretch px-12 py-10 bg-white/10 rounded-[30px] inline-flex justify-start items-center gap-20">
                <div className="justify-start text-white text-7xl font-medium">
                  안내할 거 있으면 여기에 하세요
                </div>
              </div>

              <div className="self-stretch px-12 py-10 bg-white/10 rounded-[30px] inline-flex justify-start items-center gap-20">
                <div className="justify-start text-white text-7xl font-medium">
                  안내할 거 있으면 여기에 하세요
                </div>
              </div>
            </div>

            <div className="flex justify-start items-center gap-14">
              <div className="w-[554px] h-[718px] px-12 py-24 bg-white/10 rounded-[50px] inline-flex flex-col justify-center items-center gap-20">
                <div className="text-center justify-start text-white text-7xl font-medium ">
                  빌릴게 접속
                  <br /> QR코드
                </div>
                <img
                  className="w-80 h-80"
                  src="../../public/Billilge.svg"
                  alt={"qr코드"}
                />
              </div>

              <div className="h-[718px] px-12 py-20 bg-white/10 rounded-[50px] inline-flex flex-col justify-center items-center gap-20">
                <div className="w-[454px] text-center justify-start text-white text-7xl font-medium [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                  학생회 오픈채팅
                  <br />
                  QR코드
                </div>
                <img
                  className="w-80 h-80"
                  src="../../public/OpenChatting.svg"
                  alt={"오픈채팅 qr"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
