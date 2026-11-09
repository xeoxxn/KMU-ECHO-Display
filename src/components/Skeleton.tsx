import type { CSSProperties, ReactNode } from "react";

const PULSE = "animate-pulse bg-white/15";

/**
 * 실제 콘텐츠를 `invisible`로 깔아 둔 채 그 위에 스켈레톤을 덮는다.
 * 레이아웃은 실제 콘텐츠가 잡으므로 로딩 전/후 크기가 1px도 안 바뀐다.
 * (API와 무관한 고정 텍스트·박스에 사용)
 */
export function SkeletonText({
  loading,
  children,
  className = "w-fit",
  rounded = "rounded-2xl",
}: {
  loading: boolean;
  children: ReactNode;
  /** 래퍼 크기. 기본은 내용에 딱 맞춤(w-fit) */
  className?: string;
  rounded?: string;
}) {
  if (!loading) return <>{children}</>;

  return (
    <div className={`relative ${className}`} aria-hidden>
      <div className="invisible">{children}</div>
      <div className={`absolute inset-0 ${PULSE} ${rounded}`} />
    </div>
  );
}

/**
 * 아직 데이터가 없어서 실제 텍스트를 깔 수 없을 때 쓰는 한 줄짜리 막대.
 * 실제 텍스트와 같은 타이포 클래스(text-7xl 등)를 넘기면 줄 높이가 똑같아진다.
 */
export function SkeletonLine({
  className = "",
  rounded = "rounded-2xl",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div aria-hidden className={`${PULSE} ${rounded} ${className}`}>
      &nbsp;
    </div>
  );
}

/** 고정 크기 블록(이미지 자리 등) */
export function SkeletonBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div aria-hidden className={`${PULSE} ${className}`} style={style} />;
}
