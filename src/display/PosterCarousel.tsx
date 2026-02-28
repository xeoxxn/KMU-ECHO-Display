import { useEffect, useMemo, useRef, useState } from "react";

type PosterItem = {
  posterId: string | number;
  imageUrl: string;
  title?: string;
};

export default function PosterCarousel({
  posters,
  intervalMs = 8000, // ✅ 4000 -> 8000 (넘어가는 주기 느리게)
  animMs = 300,
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

  useEffect(() => {
    if (len <= 1) return;

    const timer = window.setInterval(() => {
      if (lockRef.current) return;
      lockRef.current = true;

      setCenter((c) => mod(c + 1, len));

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
                    ? "z-10 scale-[1.14] opacity-100 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
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
