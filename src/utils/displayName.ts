export function displayNameForItem(name: string) {
  const n = name.trim();

  if (!(n.startsWith("케이블") || n.startsWith("마스크"))) return n;

  const m = n.match(/\(([^)]+)\)/);
  return m ? m[1].trim() : n;
}
