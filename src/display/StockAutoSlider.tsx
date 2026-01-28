import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import StockCard from "../cards/StockCard";

const GAP = 64;
const CARD_WIDTH = 480;
const MOVE_DURATION = 0.8;
const PAUSE_MS = 2000;

const initialStocks = [
  { title: "감기약1", leftNum: 100 },
  { title: "감기약2", leftNum: 20 },
  { title: "감기약3", leftNum: 10 },
  { title: "감기약4", leftNum: 5 },
  { title: "감기약5", leftNum: 15 },
  { title: "소화제1", leftNum: 50 },
  { title: "소화제2", leftNum: 30 },
  { title: "진통제1", leftNum: 80 },
  { title: "진통제2", leftNum: 25 },
  { title: "비타민", leftNum: 60 },
];

export default function StockAutoSlider() {
  const controls = useAnimation();
  const [queue, setQueue] = useState([...initialStocks, initialStocks[0]]);

  useEffect(() => {
    let mounted = true;

    const loop = async () => {
      await new Promise((r) => setTimeout(r, PAUSE_MS));

      while (mounted) {
        await controls.start({
          x: -CARD_WIDTH + GAP,
          transition: { duration: MOVE_DURATION, ease: "linear" },
        });

        setQueue((prev) => {
          const [first, ...rest] = prev;
          return [...rest, first];
        });

        controls.set({ x: 0 });

        await new Promise((r) => setTimeout(r, PAUSE_MS));
      }
    };

    loop();
    return () => {
      mounted = false;
    };
  }, [controls]);

  return (
    <div className="w-full bg-white/10 rounded-[60px] overflow-hidden py-20 px-16">
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
