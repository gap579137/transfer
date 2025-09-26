import { fromLocalDateTimeValue } from "./dateUtils.js";

export function calculatePercentFromSnapshots(snap1, snap2) {
  const t = Number(snap1.total) || 0;
  const u1 = Number(snap1.used) || 0;
  const u2 = Number(snap2.used) || 0;
  if (t <= 0) return null;
  const delta = Math.max(0, u1 - u2);
  const pct = (delta / t) * 100;
  if (!Number.isFinite(pct) || pct <= 0) return null;
  return pct;
}

export function calculateETA(startTime, currentTime, effectivePercent) {
  const start = fromLocalDateTimeValue(startTime);
  const curr = fromLocalDateTimeValue(currentTime);
  const p = Number(effectivePercent) / 100;

  if (!start || !curr || !(p > 0 && p <= 1)) return null;

  const elapsedMs = curr.getTime() - start.getTime();
  if (elapsedMs <= 0) return null;

  const totalMs = elapsedMs / p;
  const remainingMs = totalMs - elapsedMs;

  return new Date(curr.getTime() + remainingMs);
}

export function calculateRemainingTime(eta, currentTime) {
  if (!eta) return "—";
  const curr = fromLocalDateTimeValue(currentTime);
  const ms = eta.getTime() - curr.getTime();
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.round((ms % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}

export function calculateElapsedTime(startTime, currentTime) {
  const start = fromLocalDateTimeValue(startTime);
  const curr = fromLocalDateTimeValue(currentTime);
  if (!start || !curr) return "—";
  const ms = Math.max(0, curr.getTime() - start.getTime());
  const h = Math.floor(ms / 3_600_000);
  const m = Math.round((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export function getEffectivePercent(percentManual, pctFromSnapshots) {
  const m = Number(percentManual);
  if (Number.isFinite(m) && m > 0 && m <= 100) return m;
  return pctFromSnapshots ?? 0;
}

export function formatPercentDisplay(effectivePercent) {
  const v = Number(effectivePercent);
  return Number.isFinite(v) && v > 0 ? `${v.toFixed(2)}%` : "—";
}
