import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import StockCard from "../cards/StockCard";

export type Stock = { title: string; leftNum: number; imageUrl?: string };

type Props = {
  stocks: Stock[];
  speed?: number; // px/sec
  gapPx?: number; // 카드 간격(px) - tailwind gap-16이면 64
};

export default function StockAutoSliderVanilla({
  stocks,
  speed = 120,
  gapPx = 64,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const stepRef = useRef(0); // (card width + gap)
  const totalRef = useRef(0); // step * 원본 개수
  const xRef = useRef(0); // 현재 x
  const lastTsRef = useRef<number | null>(null);

  const items = useMemo(() => {
    if (!stocks?.length) return [];
    return [...stocks, ...stocks]; // 2배로 깔아 무한처럼 보이게
  }, [stocks]);

  // 카드 폭 측정해서 wrap 기준 계산
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || !stocks?.length) return;

    const first = el.querySelector<HTMLElement>("[data-card='stock']");
    if (!first) return;

    const cardW = first.getBoundingClientRect().width;

    const step = cardW + gapPx;
    stepRef.current = step;
    totalRef.current = step * stocks.length;

    // 리셋
    xRef.current = 0;
    el.style.transform = "translate3d(0,0,0)";
  }, [stocks.length, gapPx]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !stocks?.length) return;

    let mounted = true;

    const loop = (ts: number) => {
      if (!mounted) return;

      if (lastTsRef.current == null) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;

      const total = totalRef.current;
      if (total > 0) {
        const move = (delta / 1000) * speed;
        let next = xRef.current - move;

        // 한 바퀴(원본 길이)만큼 가면 되감기
        if (next <= -total) next += total;

        xRef.current = next;
        el.style.transform = `translate3d(${next}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [stocks.length, speed]);

  if (!stocks?.length) return null;

  return (
    <div className="w-full overflow-hidden rounded-[60px] bg-white/10 py-20 px-16">
      <div
        ref={trackRef}
        className="flex"
        style={{ gap: `${gapPx}px`, willChange: "transform" }}
      >
        {items.map((item, i) => (
          <div
            key={`${item.title}-${i}`}
            data-card="stock"
            className="shrink-0"
          >
            <StockCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
