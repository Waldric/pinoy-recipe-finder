export function formatMinutes(mins) {
  if (typeof mins !== "number" || isNaN(mins) || mins < 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h} hr`;
  return `${h} hr ${m} min`;
}
