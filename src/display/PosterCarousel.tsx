import { useEffect, useMemo, useRef, useState } from "react";

type PosterItem = {
  posterId: string | number;
  imageUrl: string;
  title?: string;
};

const CARD_WIDTH = 742;
const GAP = 80;
const ITEM_WIDTH = CARD_WIDTH + GAP;
const VIEW_WIDTH = ITEM_WIDTH * 3 - GAP;

export default function PosterCarousel({
  posters,
  intervalMs = 4000,
  animMs = 1500,
}: {
  posters: PosterItem[];
  intervalMs?: number;
  animMs?: number;
}) {
  const len = posters.length;
  const [center, setCenter] = useState(0);
  const [step, setStep] = useState<0 | 1>(0);
  const [snap, setSnap] = useState(false);
  const lockRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const mod = (n: number) => ((n % len) + len) % len;

  if (len === 0) return null;

  const visible = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((i) => posters[mod(center + i)]);
  }, [center, posters]);

  useEffect(() => {
    if (len <= 1) return;

    const timer = window.setInterval(() => {
      if (lockRef.current) return;
      lockRef.current = true;

      setSnap(false);
      setStep(1); // 왼쪽으로 한 칸 애니메이션

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setSnap(true);
        setCenter((c) => mod(c + 1));
        setStep(0);

        requestAnimationFrame(() => {
          setSnap(false);
          lockRef.current = false;
        });
      }, animMs);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      lockRef.current = false;
    };
  }, [len, intervalMs, animMs]);

  const BASE_X = -ITEM_WIDTH;
  const translateX = BASE_X - step * ITEM_WIDTH;

  const centerIdx = step === 0 ? 2 : 3;

  return (
    <div className="relative w-full flex justify-center">
      <div className="overflow-hidden" style={{ width: VIEW_WIDTH }}>
        <div
          className="flex items-center"
          style={{
            gap: GAP,
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: snap
              ? "none"
              : `transform ${animMs}ms cubic-bezier(0.22,0.61,0.36,1)`,
            willChange: "transform",
          }}
        >
          {visible.map((poster, idx) => {
            const isCenter = idx === centerIdx;

            return (
              <div
                key={`${poster.posterId}-${idx}`}
                className="flex-shrink-0 relative rounded-[40px] overflow-hidden"
                style={{ width: CARD_WIDTH }}
              >
                <div
                  className={[
                    "transform-gpu transition-[transform,opacity] ease-out",
                    isCenter
                      ? "scale-[1.04] opacity-100"
                      : "scale-90 opacity-45",
                  ].join(" ")}
                  style={{
                    transitionDuration: snap ? "0ms" : `${animMs}ms`,
                  }}
                >
                  <img
                    src={poster.imageUrl}
                    alt={poster.title ?? "poster"}
                    className="w-[742px] h-[1005px] object-cover"
                    draggable={false}
                  />
                  <div
                    className={[
                      "absolute inset-0 transition-colors",
                      isCenter ? "bg-black/0" : "bg-black/45",
                    ].join(" ")}
                    style={{
                      transitionDuration: snap ? "0ms" : `${animMs}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
