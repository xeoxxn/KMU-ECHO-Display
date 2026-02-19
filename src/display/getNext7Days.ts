export default function getNext7Days() {
  const today = new Date(2026, 1, 23); // 2026-02-23 (month는 0부터니까 1=2월)
  const days = [];

  const MOCK_EVENTS: Record<string, string[]> = {
    "2026-02-20": ["소융대 교내 OT"],
    "2026-02-21": [],
    "2026-02-22": [],
    "2026-02-23": ["사물함 정리기간", "졸업연기 및 탈락자 수강 신청"],
    "2026-02-24": ["사물함 정리기간", "3차 장바구니"],
    "2026-02-25": ["사물함 정리기간", "신입생 및 편입생 수강신청"],
    "2026-02-26": ["사물함 정리기간", "새내기 배움터"],
  };

  for (let offset = -3; offset <= 3; offset++) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + offset,
    );

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    days.push({
      year,
      month,
      day,
      events: MOCK_EVENTS[key] ?? [],
      isToday: offset === 0,
      isSaturday: dayOfWeek === 6,
      isSunday: dayOfWeek === 0,
    });
  }

  return days;
}
