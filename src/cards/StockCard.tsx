import Medicine from "../assets/logo/Medicine.tsx";
import { SkeletonBlock, SkeletonLine } from "../components/Skeleton.tsx";

interface StockCardProps {
  title: string;
  leftNum: number;
  imageUrl?: string;
}

// 실제 카드와 스켈레톤이 같은 클래스를 공유해야 크기가 정확히 같아진다.
const CARD =
  "w-92 shrink-0 px-20 py-20 bg-white/20 rounded-[50px] flex justify-center items-center";
const BODY = "flex flex-col items-center gap-12";
const IMAGE = "w-48 h-48 rounded-full";
const TEXTS = "flex flex-col items-center gap-7 w-full";
const TITLE = "text-7xl font-medium";
const COUNT = "text-4xl font-normal";

export default function StockCard({
  title,
  leftNum,
  imageUrl,
}: StockCardProps) {
  const displayNum = leftNum > 99 ? "99+" : leftNum;

  return (
    <div className={CARD}>
      <div className={BODY}>
        <div
          className={`${IMAGE} p-5 bg-zinc-100 flex justify-center items-center overflow-hidden`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-contain"
              decoding="async"
            />
          ) : (
            <Medicine />
          )}
        </div>

        <div className={TEXTS}>
          <div className={`${TITLE} text-white text-center truncate w-full`}>
            {title}
          </div>

          <div className={`${COUNT} text-white whitespace-nowrap`}>
            남은 개수: {displayNum}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StockCardSkeleton() {
  return (
    <div className={CARD} aria-hidden>
      <div className={BODY}>
        <SkeletonBlock className={IMAGE} />
        <div className={TEXTS}>
          <SkeletonLine className={`${TITLE} w-full`} />
          <SkeletonLine className={`${COUNT} w-[4.8em]`} rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
