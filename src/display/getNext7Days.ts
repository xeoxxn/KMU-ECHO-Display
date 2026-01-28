export default function getNext7Days() {
  const today = new Date(2026, 4, 31); // month는 0부터
  const days = [];

  const MOCK_EVENTS: Record<string, string[]> = {
    "2026-05-28": ["수강신청 기간", "서해수호의 날"],
    "2026-05-29": ["수강신청 기간"],
    "2026-05-30": ["기말고사"],
    "2026-05-31": ["기말고사"],
    "2026-06-01": ["기말고사"],
    "2026-06-02": ["이동규 똥", "이상래 화장실"],
    "2026-06-03": ["이승찬 변비"],
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
