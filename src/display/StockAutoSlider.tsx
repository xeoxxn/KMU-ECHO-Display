import { motion, useAnimation } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import StockCard from "../cards/StockCard";

const MOVE_DURATION = 0.8;
const PAUSE_MS = 2000;

export type Stock = { title: string; leftNum: number; imageUrl?: string };
type Props = { stocks: Stock[] };

export default function StockAutoSlider({ stocks }: Props) {
  const controls = useAnimation();
  const [queue, setQueue] = useState<Stock[]>(stocks ?? []);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef<number>(0); // 한 칸 이동 거리(px)

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const first = el.querySelector<HTMLElement>("[data-card='stock']");
    if (!first) return;

    const cardW = first.getBoundingClientRect().width;

    // gap은 flex container의 column-gap을 읽어옴
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || "0");

    stepRef.current = cardW + gap;
  }, [queue.length]);

  // stocks 바뀌면 리셋
  useEffect(() => {
    setQueue(stocks ?? []);
    controls.stop();
    controls.set({ x: 0 });
  }, [stocks, controls]);

  const ready = queue.length >= 2;

  useEffect(() => {
    if (!ready) return;

    let mounted = true;

    const loop = async () => {
      await new Promise((r) => setTimeout(r, PAUSE_MS));

      while (mounted) {
        const step = stepRef.current || 0;
        if (!step) {
          await new Promise((r) => setTimeout(r, 200));
          continue;
        }

        await controls.start({
          x: -step,
          transition: { duration: MOVE_DURATION, ease: "linear" },
        });

        setQueue((prev) => {
          const [first, ...rest] = prev;
          return first ? [...rest, first] : prev;
        });

        controls.set({ x: 0 });
        await new Promise((r) => setTimeout(r, PAUSE_MS));
      }
    };

    loop();
    return () => {
      mounted = false;
    };
  }, [controls, ready]);

  if (!queue.length) return null;

  return (
    <div className="w-full rounded-[60px] bg-white/10 overflow-hidden py-20 px-16">
      <div className="w-full overflow-hidden rounded-[60px]">
        <motion.div ref={wrapRef} className="flex gap-16" animate={controls}>
          {queue.map((item, i) => (
            <div key={`${item.title}-${i}`} data-card="stock">
              <StockCard {...item} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
