import kmuLogo from "./kmu-logo.png";

// 예전엔 4096x4096 PNG를 base64로 SVG 안에 넣어서(1.3MB) 240px로 그렸는데,
// 라즈베리파이에서 디코딩 비용/메모리(약 67MB)가 커서 486px PNG로 교체함.
// 크기(243x243, 부모 240px 박스에서 잘림)는 예전 SVG와 동일하게 유지.
export default function KMU_LOGO() {
  return (
    <img
      src={kmuLogo}
      width={243}
      height={243}
      alt="국민대학교 로고"
      className="max-w-none"
      decoding="async"
      draggable={false}
    />
  );
}
