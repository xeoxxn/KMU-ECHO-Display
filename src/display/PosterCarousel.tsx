import { useEffect, useMemo, useRef, useState } from "react";

type PosterItem = {
  posterId: string | number;
  imageUrl: string;
  title?: string;
};

export default function PosterCarousel({
  posters,
  intervalMs = 4000,
  animMs = 320,
}: {
  posters: PosterItem[];
  intervalMs?: number;
  animMs?: number;
}) {
  const len = posters.length;
  const [center, setCenter] = useState(0);

  // 슬라이드 애니 상태: 0(정지) | 1(다음으로 이동)
  const [sliding, setSliding] = useState<0 | 1>(0);

  const lockRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (len <= 1) return;

    const timer = window.setInterval(() => {
      if (lockRef.current) return;
      lockRef.current = true;

      setSliding(1);

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setCenter((c) => mod(c + 1, len));
        setSliding(0);
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

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex w-full justify-center items-center gap-20">
        {visible.map(({ pos, poster }) => {
          const isCenter = pos === "center";

          const shift =
            sliding === 1
              ? pos === "left"
                ? "-115%" // 왼쪽 카드가 밖으로 빠짐
                : pos === "center"
                  ? "-115%" // 가운데가 왼쪽으로
                  : "-115%" // 오른쪽이 가운데로 들어오는 느낌
              : "0%";

          return (
            <div
              key={`${pos}-${poster.posterId}`}
              className="flex justify-center"
            >
              <div
                className={[
                  "relative overflow-hidden rounded-[40px]",
                  "transform-gpu transition-[transform,opacity] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                  isCenter
                    ? "z-10 scale-[1.14] opacity-100 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                    : "scale-[0.90] opacity-45",
                ].join(" ")}
                style={{
                  transitionDuration: `${animMs}ms`,
                  transform: `translate3d(${shift},0,0) ${isCenter ? "scale(1.14)" : "scale(0.90)"}`,
                }}
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
