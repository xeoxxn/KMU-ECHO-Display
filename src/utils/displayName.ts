export function displayNameForItem(name: string) {
  const n = name.trim();

  let result = n;

  if (n.startsWith("케이블") || n.startsWith("마스크")) {
    const m = n.match(/\(([^)]+)\)/);
    result = m ? m[1].trim() : n;
  }

  result = result.replace("소형", "소").replace("대형", "대");

  if (result.length > 7) {
    result = result.slice(0, 4) + "...";
  }

  return result;
}
