import { useEffect, useState } from "react";

type Unit = "minute" | "day";

const keyOf = (d: Date, unit: Unit) => {
  const day = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  return unit === "day" ? day : `${day} ${d.getHours()}:${d.getMinutes()}`;
};

const msUntilNextMinute = (d: Date) =>
  60_000 - (d.getSeconds() * 1000 + d.getMilliseconds());

/**
 * 현재 시각을 돌려주되, `unit`(분/일)이 바뀔 때만 리렌더한다.
 * 매초 setState 하던 걸 대체 — 화면엔 시:분까지만 나오므로 1초 틱은 낭비.
 * 매 분 경계마다 확인하므로 라파이 부팅 직후 NTP로 시계가 점프해도 1분 안에 맞춰진다.
 */
export function useNow(unit: Unit) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let id: number;

    const schedule = () => {
      id = window.setTimeout(
        () => {
          const next = new Date();
          setNow((prev) =>
            keyOf(prev, unit) === keyOf(next, unit) ? prev : next,
          );
          schedule();
        },
        msUntilNextMinute(new Date()) + 50,
      );
    };

    schedule();
    return () => window.clearTimeout(id);
  }, [unit]);

  return now;
}
