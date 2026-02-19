import KMU_LOGO from "../assets/logo/KMU_LOGO.tsx";
import { useEffect, useState } from "react";
import WeekCard from "../cards/WeekCard.tsx";
import getNext7Days from "./getNext7Days.ts";
import StockAutoSlider from "./StockAutoSlider.tsx";

export default function Display() {
  {
    /* date */
  }
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  const week = ["일", "월", "화", "수", "목", "금", "토", "일"];
  const dayofWeek = week[now.getDay()];
  {
    /* hours */
  }
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const weekDays = getNext7Days();

  return (
    <div className="w-[3024px] h-[5291px] px-40 py-36 bg-gradient-to-l from-neutral-900 to-green-900 inline-flex flex-col justify-center items-center gap-36">
      <div className="flex flex-col justify-start items-start gap-20">
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
        <div className="self-stretch flex flex-col justify-start items-start gap-14">
          <div className="w-109 justify-start text-white text-8xl font-semibold ">
            행사 안내
          </div>
          <div className="self-stretch px-24 py-28 bg-white/10 rounded-[50px] inline-flex justify-center items-center gap-20">
            <img
              className="w-[742px] h-[1005px] opacity-50"
              src="src/assets/poster/poster1.jpeg"
            />
            <img
              className="w-[859px] h-[1163px]"
              src="src/assets/poster/poster2.jpeg"
            />
            <img
              className="w-[742px] h-[1005px] opacity-50"
              src="src/assets/poster/poster3.jpeg"
            />
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-14">
          <div className="justify-start text-white text-8xl font-semibold ">
            {todayMonth}월 학사 일정
          </div>
          <div className="self-stretch px-12 py-20 bg-white/20 rounded-[50px] inline-flex justify-center items-center gap-10">
            {weekDays.map((item) => (
              <WeekCard
                key={`${item.year}-${item.month}-${item.day}`}
                year={item.year}
                month={item.month}
                day={item.day}
                events={item.events}
                isToday={item.isToday}
              />
            ))}
          </div>
        </div>
        <div className="w-[2703px] flex flex-col justify-start items-start gap-14">
          <div className="p-2.5 inline-flex justify-center items-center gap-2.5">
            <div className="justify-start text-white text-8xl font-semibold ">
              복지물품 재고 현황
            </div>
          </div>
          <StockAutoSlider />
        </div>
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
                  src="src/assets/qrcode/Billilge.svg"
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
                  src="src/assets/qrcode/OpenChatting.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
