export function displayNameForItem(name: string) {
  const n = name.trim();

  let result = n;

  if (n.startsWith("케이블") || n.startsWith("마스크")) {
    const m = n.match(/\(([^)]+)\)/);
    result = m ? m[1].trim() : n;
  }

  // 소형 -> 소, 대형 -> 대
  result = result.replace("소형", "소").replace("대형", "대");

  // 4글자 초과면 말줄임
  if (result.length > 4) {
    result = result.slice(0, 4) + "...";
  }

  return result;
}
