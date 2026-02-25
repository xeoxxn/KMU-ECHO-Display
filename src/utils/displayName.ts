export function displayNameForItem(name: string) {
  if (!(name.startsWith("케이블(") || name.startsWith("마스크"))) {
    return name;
  }

  const m = name.match(/\(([^)]+)\)/);
  return m ? m[1].trim() : name;
}
