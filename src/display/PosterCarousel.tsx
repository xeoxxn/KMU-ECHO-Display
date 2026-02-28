import { useEffect, useMemo, useRef, useState } from "react";

type PosterItem = {
  posterId: string | number;
  imageUrl: string;
  title?: string;
};

type Phase = "idle" | "slide";
type Slot = "left" | "center" | "right";
type Role = "L" | "C" | "R";

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
  const [phase, setPhase] = useState<Phase>("idle");

  const lockRef = useRef(false);
  const animTimeoutRef = useRef<number | null>(null);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  if (len === 0) return null;

  const prevIdx = mod(center - 1, len);
  const nextIdx = mod(center + 1, len);

  const cards = useMemo(() => {
    const base = {
      L: { role: "L" as const, poster: posters[prevIdx] },
      C: { role: "C" as const, poster: posters[center] },
      R: { role: "R" as const, poster: posters[nextIdx] },
    };

    const slotByRole: Record<Role, Slot> =
      phase === "idle"
        ? { L: "left", C: "center", R: "right" }
        : { L: "left", C: "left", R: "center" };

    return (Object.keys(base) as Role[]).map((r) => ({
      role: base[r].role,
      poster: base[r].poster,
      slot: slotByRole[r],
    }));
  }, [posters, prevIdx, center, nextIdx, phase]);

  useEffect(() => {
    if (len <= 1) return;

    const timer = window.setInterval(() => {
      if (lockRef.current) return;
      lockRef.current = true;

      setPhase("slide");

      if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = window.setTimeout(() => {
        setCenter((c) => mod(c + 1, len));
        setPhase("idle");
        lockRef.current = false;
      }, animMs);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = null;
      lockRef.current = false;
    };
  }, [len, intervalMs, animMs]);

  const slotClass = (slot: Slot) => {
    if (slot === "center") {
      return "z-10 scale-[1.14] opacity-100 shadow-[0_30px_90px_rgba(0,0,0,0.45)]";
    }
    return "scale-[0.90] opacity-45";
  };

  const overlayClass = (slot: Slot) =>
    slot === "center" ? "bg-black/0" : "bg-black/45";

  return (
    <div className="relative w-full">
      <div className="flex w-full justify-center items-center gap-20">
        {cards.map(({ role, poster, slot }) => (
          <div
            key={`${role}-${poster.posterId}`}
            className="flex justify-center"
          >
            <div
              className={[
                "relative overflow-hidden rounded-[40px]",
                "transform-gpu transition-[transform,opacity] ease-out",
                slotClass(slot),
              ].join(" ")}
              style={{ transitionDuration: `${animMs}ms` }}
            >
              <img
                src={poster.imageUrl}
                alt={poster.title ?? "poster"}
                draggable={false}
                loading={slot === "center" ? "eager" : "lazy"}
                decoding="async"
                className="w-[742px] h-[1005px] object-cover"
                onError={() =>
                  console.log("poster img error:", poster.imageUrl, poster)
                }
              />
              <div
                className={[
                  "absolute inset-0 transition-colors",
                  overlayClass(slot),
                ].join(" ")}
                style={{ transitionDuration: `${animMs}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
