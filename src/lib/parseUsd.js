/** Parse stored estimated-worth text into USD for exchange detail totals. */

export function estimatedWorthToUsd(raw) {
  const t = String(raw ?? "").trim();
  const n = Number.parseFloat(t.replace(/[^0-9.]/g, ""));
  if (Number.isFinite(n)) return Math.max(0, Math.round(n * 100) / 100);
  return 25;
}
