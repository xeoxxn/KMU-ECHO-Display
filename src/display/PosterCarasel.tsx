import { useEffect, useState } from "react";

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

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  const prevIdx = mod(center - 1, len);
  const nextIdx = mod(center + 1, len);

  const visible =
    len === 0
      ? []
      : [
          { pos: "left" as const, poster: posters[prevIdx] },
          { pos: "center" as const, poster: posters[center] },
          { pos: "right" as const, poster: posters[nextIdx] },
        ];

  // 자동 슬라이드
  useEffect(() => {
    if (len <= 1) return;

    const timer = setInterval(() => {
      setOffset(1);

      setTimeout(() => {
        setCenter((c) => mod(c + 1, len));
        setOffset(0);
      }, animMs);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [len, intervalMs, animMs]);

  if (len === 0) return null;

  const translatePercent = -100 - offset * 100;

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
            <div key={poster.posterId} className="w-1/3 px-10">
              <div
                className={[
                  "relative overflow-hidden rounded-[40px]",
                  "transform-gpu transition-[transform,opacity] duration-300 ease-out",
                  isCenter
                    ? "z-10 -translate-y-6 scale-[1.08] opacity-100"
                    : "scale-[0.92] opacity-55",
                ].join(" ")}
              >
                <img
                  src={poster.imageUrl}
                  alt={poster.title ?? "poster"}
                  draggable={false}
                  loading={isCenter ? "eager" : "lazy"}
                  decoding="async"
                  className="w-[742px] h-[1005px] object-cover"
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
