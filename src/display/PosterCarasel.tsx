import { useEffect, useMemo, useRef, useState } from "react";

type PosterItem = {
  posterId: string | number;
  imageUrl: string;
  title?: string;
};

export default function PosterCarousel({
  posters,
  intervalMs = 4000,
  animMs = 300,
}: {
  posters: PosterItem[];
  intervalMs?: number;
  animMs?: number;
}) {
  const len = posters.length;
  const [center, setCenter] = useState(0);
  const [offset, setOffset] = useState<-1 | 0 | 1>(0);
  const timeoutRef = useRef<number | null>(null);
  const lockRef = useRef(false);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  // len=0이면 바로 종료 (NaN 방지)
  if (len === 0) return null;

  const prevIdx = mod(center - 1, len);
  const nextIdx = mod(center + 1, len);

  const visible = useMemo(
    () => [
      { pos: "left" as const, poster: posters[prevIdx] },
      { pos: "center" as const, poster: posters[center] },
      { pos: "right" as const, poster: posters[nextIdx] },
    ],
    [posters, prevIdx, center, nextIdx],
  );

  // 자동 슬라이드 (중복/누수 방지)
  useEffect(() => {
    if (len <= 1) return;

    const timer = window.setInterval(() => {
      if (lockRef.current) return;
      lockRef.current = true;

      setOffset(1);

      // 이전 timeout 정리
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        setCenter((c) => mod(c + 1, len));
        setOffset(0);
        lockRef.current = false;
      }, animMs);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      lockRef.current = false;
    };
  }, [len, intervalMs, animMs]);

  /**
   * ✅ 핵심 수정
   * track이 w-[300%]라서 translate의 %는 "트랙 너비 기준"임.
   * 3칸 중 1칸 이동 = 100/3 (%) 단위로 움직여야 화면에 보임.
   */
  const STEP = 100 / 3;
  const translatePercent = -STEP * (1 + offset); // center가 기본(-33.333%)

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={[
          "flex w-[300%] will-change-transform",
          offset !== 0
            ? "transition-transform ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            : "",
        ].join(" ")}
        style={{
          transform: `translate3d(${translatePercent}%,0,0)`,
          transitionDuration: offset !== 0 ? `${animMs}ms` : undefined,
        }}
      >
        {visible.map(({ pos, poster }) => {
          const isCenter = pos === "center";

          return (
            <div
              key={poster.posterId}
              className="w-1/3 px-10 flex justify-center"
            >
              <div
                className={[
                  "relative overflow-hidden rounded-[40px]",
                  "transform-gpu transition-[transform,opacity] duration-300 ease-out",
                  isCenter
                    ? "z-10 -translate-y-6 scale-[1.14] opacity-100 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                    : "scale-[0.90] opacity-45",
                ].join(" ")}
              >
                <img
                  src={poster.imageUrl}
                  alt={poster.title ?? "poster"}
                  draggable={false}
                  loading={isCenter ? "eager" : "lazy"}
                  decoding="async"
                  className="w-[820px] h-[1110px] object-cover"
                  onError={() =>
                    console.log("poster img error:", poster.imageUrl, poster)
                  }
                />

                <div
                  className={[
                    "absolute inset-0 transition-colors duration-300",
                    isCenter ? "bg-black/0" : "bg-black/35",
                  ].join(" ")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
