import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { SkeletonBlock } from "../components/Skeleton.tsx";

export type PosterItem = {
  posterId: string | number;
  imageUrl: string;
  title?: string;
};

const BASE_CARD_W = 742;
const BASE_CARD_H = 1005;
const BASE_GAP = 40;

const SCALE = 1.15;

const CARD_WIDTH = Math.round(BASE_CARD_W * SCALE);
const CARD_HEIGHT = Math.round(BASE_CARD_H * SCALE);
const GAP = Math.round(BASE_GAP * SCALE);

const ITEM_WIDTH = CARD_WIDTH + GAP;
const VIEW_WIDTH = ITEM_WIDTH * 3 - GAP;

const EDGE_CROP = Math.round(50 * SCALE); // 예: 80px(기본) * scale
const BASE_X = -ITEM_WIDTH - Math.floor(EDGE_CROP / 2);

// 화면에 깔아 두는 슬롯: 가운데(0) 기준 좌우 2장씩
const OFFSETS = [-2, -1, 0, 1, 2] as const;
const EASE = "cubic-bezier(0.22,0.61,0.36,1)";

const CARD_SLOT = "relative flex-shrink-0 overflow-hidden";
const CENTER_CARD = "scale-[1.04] opacity-100";
const SIDE_CARD = "scale-90 opacity-45";

/** 실제 캐러셀과 스켈레톤이 같은 틀을 쓰도록 분리 */
function Frame({
  trackRef,
  trackStyle,
  children,
}: {
  trackRef?: Ref<HTMLDivElement>;
  trackStyle: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="relative flex w-full justify-center">
      <div className="overflow-hidden" style={{ width: VIEW_WIDTH }}>
        <div
          ref={trackRef}
          className="flex items-center"
          style={{ gap: GAP, willChange: "transform", ...trackStyle }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function PosterCarousel({
  posters,
  intervalMs = 4000,
  animMs = 1500,
}: {
  posters: PosterItem[];
  intervalMs?: number;
  animMs?: number;
}) {
  const len = posters.length;
  // center는 mod 하지 않은 "절대" 인덱스. key로 써서 슬라이드마다 <img>가 재생성되지 않게 한다.
  const [center, setCenter] = useState(0);
  const [step, setStep] = useState<0 | 1>(0);
  const [snap, setSnap] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (len <= 1) return;

    let id: number;
    const slide = () => {
      setSnap(false);
      setStep(1);

      id = window.setTimeout(() => {
        // 애니메이션이 끝나면 transition 없이 한 칸 되돌리면서 center를 +1
        setSnap(true);
        setStep(0);
        setCenter((c) => c + 1);
        id = window.setTimeout(slide, Math.max(0, intervalMs - animMs));
      }, animMs);
    };

    id = window.setTimeout(slide, intervalMs);
    return () => window.clearTimeout(id);
  }, [len, intervalMs, animMs]);

  // snap(transition: none)이 커밋되면 강제로 reflow 한 뒤 transition을 다시 켠다.
  // 예전 requestAnimationFrame 방식은 느린 기기에서 React 커밋보다 rAF가 먼저 돌면
  // 두 상태가 한 번에 묶여 포스터가 뒤로 1.5초 미끄러지는 현상이 생길 수 있었음.
  useLayoutEffect(() => {
    if (!snap) return;
    trackRef.current?.getBoundingClientRect();
    setSnap(false);
  }, [snap]);

  if (len === 0) return null;

  const mod = (n: number) => ((n % len) + len) % len;
  const translateX = BASE_X - step * ITEM_WIDTH;
  const centerAbs = center + step;
  const duration = snap ? "0ms" : `${animMs}ms`;

  return (
    <Frame
      trackRef={trackRef}
      trackStyle={{
        transform: `translate3d(${translateX}px, 0, 0)`,
        transition: snap ? "none" : `transform ${animMs}ms ${EASE}`,
      }}
    >
      {OFFSETS.map((offset) => {
        const abs = center + offset;
        const poster = posters[mod(abs)];
        const isCenter = abs === centerAbs;

        return (
          <div key={abs} className={CARD_SLOT} style={{ width: CARD_WIDTH }}>
            <div
              className={`transform-gpu transition-[transform,opacity] ease-out ${
                isCenter ? CENTER_CARD : SIDE_CARD
              }`}
              style={{ transitionDuration: duration }}
            >
              <img
                src={poster.imageUrl}
                alt={poster.title ?? "poster"}
                className="object-cover"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                decoding="async"
                draggable={false}
              />

              {/* background-color 트랜지션은 매 프레임 repaint라서 opacity로 처리 */}
              <div
                className={`absolute inset-0 bg-black transition-opacity ${
                  isCenter ? "opacity-0" : "opacity-45"
                }`}
                style={{ transitionDuration: duration }}
              />
            </div>
          </div>
        );
      })}
    </Frame>
  );
}

export default memo(PosterCarousel);

/** 로딩 중: 실제 캐러셀과 같은 틀/같은 카드 크기·배율로 자리만 잡아 둔다 */
export function PosterCarouselSkeleton() {
  return (
    <Frame trackStyle={{ transform: `translate3d(${BASE_X}px, 0, 0)` }}>
      {OFFSETS.map((offset) => (
        <div key={offset} className={CARD_SLOT} style={{ width: CARD_WIDTH }}>
          <div className={offset === 0 ? CENTER_CARD : SIDE_CARD}>
            <SkeletonBlock style={{ width: CARD_WIDTH, height: CARD_HEIGHT }} />
          </div>
        </div>
      ))}
    </Frame>
  );
}
