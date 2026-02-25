import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import StockCard from "../cards/StockCard";

const GAP = 64;
const CARD_WIDTH = 480;
const MOVE_DURATION = 0.8;
const PAUSE_MS = 2000;

export type Stock = {
  title: string;
  leftNum: number;
  imageUrl?: string;
};

type Props = {
  stocks: Stock[];
};

export default function StockAutoSlider({ stocks }: Props) {
  const controls = useAnimation();
  const [queue, setQueue] = useState<Stock[]>(stocks ?? []);

  // ✅ 동일 내용이면 리셋 방지용(간단 키)
  const stocksKey = (stocks ?? [])
    .map((s) => `${s.title}:${s.leftNum}:${s.imageUrl ?? ""}`)
    .join("|");
  const prevKeyRef = useRef<string>("");

  useEffect(() => {
    if (prevKeyRef.current === stocksKey) return; // 내용 동일 → 유지
    prevKeyRef.current = stocksKey;

    setQueue(stocks ?? []);
    controls.stop(); // 진행중 애니메이션 중단
    controls.set({ x: 0 }); // 위치 리셋
  }, [stocksKey, stocks, controls]);

  const ready = queue.length >= 2;

  useEffect(() => {
    if (!ready) return;

    let mounted = true;

    const loop = async () => {
      await new Promise((r) => setTimeout(r, PAUSE_MS));

      while (mounted) {
        await controls.start({
          x: -(CARD_WIDTH + GAP),
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
        <motion.div className="flex gap-16" animate={controls}>
          {queue.map((item, i) => (
            <StockCard key={`${item.title}-${i}`} {...item} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
