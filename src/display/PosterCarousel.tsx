import { useEffect, useMemo, useRef, useState } from "react";

type PosterItem = {
  posterId: string | number;
  imageUrl: string;
  title?: string;
};

export default function PosterCarousel({
  posters,
  intervalMs = 4000,
  animMs = 300, // (여기서는 duration에만 씀)
}: {
  posters: PosterItem[];
  intervalMs?: number;
  animMs?: number;
}) {
  const len = posters.length;
  const [center, setCenter] = useState(0);
  const lockRef = useRef(false);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

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

  // ✅ 자동 슬라이드: translate 없이 "데이터만" 교체 => 항상 3개가 동시에 보임
  useEffect(() => {
    if (len <= 1) return;

    const timer = window.setInterval(() => {
      if (lockRef.current) return;
      lockRef.current = true;

      // 살짝 락 걸고 다음으로
      setCenter((c) => mod(c + 1, len));

      // 다음 tick까지 중복 방지용(애니메이션 시간 정도만)
      window.setTimeout(() => {
        lockRef.current = false;
      }, animMs);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [len, intervalMs, animMs]);

  return (
    <div className="relative w-full">
      <div className="flex w-full justify-center items-center gap-20">
        {visible.map(({ pos, poster }) => {
          const isCenter = pos === "center";

          return (
            <div
              key={`${pos}-${poster.posterId}`}
              className="flex justify-center"
            >
              <div
                className={[
                  "relative overflow-hidden rounded-[40px]",
                  "transform-gpu transition-[transform,opacity] ease-out",
                  isCenter
                    ? "z-10 -translate-y-6 scale-[1.14] opacity-100 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                    : "scale-[0.90] opacity-45",
                ].join(" ")}
                style={{ transitionDuration: `${animMs}ms` }}
              >
                <img
                  src={poster.imageUrl}
                  alt={poster.title ?? "poster"}
                  draggable={false}
                  loading={isCenter ? "eager" : "lazy"}
                  decoding="async"
                  className="w-[742px] h-[1005px] object-cover"
                  onError={() =>
                    console.log("poster img error:", poster.imageUrl, poster)
                  }
                />

                <div
                  className={[
                    "absolute inset-0 transition-colors",
                    isCenter ? "bg-black/0" : "bg-black/45",
                  ].join(" ")}
                  style={{ transitionDuration: `${animMs}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
