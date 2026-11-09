import { memo, useLayoutEffect, useMemo, useRef } from "react";
import StockCard, { StockCardSkeleton } from "../cards/StockCard";

export type Stock = { title: string; leftNum: number; imageUrl?: string };

type Props = {
  stocks: Stock[];
  loading?: boolean;
  speed?: number; // px/sec
  gapPx?: number; // 카드 간격(px) - tailwind gap-16이면 64
};

const FRAME = "w-full overflow-hidden rounded-[60px] bg-white/10 py-20 px-16";
// 프레임 안쪽 폭(2575px)에 카드(368px + gap 64px)가 6장 남짓 보이므로 7장이면 꽉 찬다
const SKELETON_COUNT = 7;

function StockAutoSlider({
  stocks,
  loading = false,
  speed = 120,
  gapPx = 64,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    if (!stocks?.length) return [];
    return [...stocks, ...stocks]; // 2배로 깔아 무한처럼 보이게
  }, [stocks]);

  // 예전: requestAnimationFrame마다 JS로 style.transform을 써서 메인 스레드가 조금만 바빠도 끊김.
  // 지금: Web Animations API → 브라우저 컴포지터 스레드에서 돌아서 JS/React 작업과 무관하게 부드럽게 움직인다.
  useLayoutEffect(() => {
    const el = trackRef.current;
    const n = stocks.length;
    if (loading || !el || n === 0) return;

    const first = el.children[0] as HTMLElement | undefined;
    const firstCopy = el.children[n] as HTMLElement | undefined;
    if (!first || !firstCopy) return;

    // 원본 한 바퀴 길이 = (카드 폭 + gap) * 원본 개수
    const distance = firstCopy.offsetLeft - first.offsetLeft;
    if (distance <= 0) return;

    const anim = el.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: `translate3d(${-distance}px, 0, 0)` },
      ],
      {
        duration: (distance / speed) * 1000,
        iterations: Infinity,
        easing: "linear",
      },
    );

    return () => anim.cancel();
  }, [loading, stocks.length, speed, gapPx]);

  if (loading) {
    return (
      <div className={FRAME}>
        <div className="flex" style={{ gap: `${gapPx}px` }}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <StockCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!stocks?.length) return null;

  return (
    <div className={FRAME}>
      <div
        ref={trackRef}
        className="flex"
        style={{ gap: `${gapPx}px`, willChange: "transform" }}
      >
        {items.map((item, i) => (
          <StockCard key={`${item.title}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export default memo(StockAutoSlider);
