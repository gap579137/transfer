export function calculatePercentFromSnapshots(snap1, snap2) {
  const u1 = Number(snap1.used) || 0; // Used space on A (TB)
  const u2 = Number(snap2.used) || 0; // Used space on B (TB)
  if (u1 <= 0) return null; // Can't divide by zero
  const pct = (u2 / u1) * 100;
  if (!Number.isFinite(pct) || pct < 0) return null;
  return pct;
}

// Calculate transfer speed from snapshot history
export function calculateTransferSpeed(snapshotHistory, snapshotName = "B") {
  if (!snapshotHistory || snapshotHistory.length < 2) {
    return null; // Need at least 2 data points
  }

  // Filter history for the specific snapshot (usually B for destination)
  const relevantHistory = snapshotHistory
    .filter((h) => h.snapshotName === snapshotName)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  if (relevantHistory.length < 2) {
    return null;
  }

  // Get the last two entries to calculate speed
  const latest = relevantHistory[relevantHistory.length - 1];
  const previous = relevantHistory[relevantHistory.length - 2];

  const dataTransferred = latest.used - previous.used; // TB
  const timeElapsed = new Date(latest.createdAt) - new Date(previous.createdAt); // milliseconds

  if (timeElapsed <= 0 || dataTransferred <= 0) {
    return null;
  }

  // Convert to TB/hour
  const hoursElapsed = timeElapsed / (1000 * 60 * 60);
  const speedTBPerHour = dataTransferred / hoursElapsed;

  return {
    speed: speedTBPerHour,
    unit: "TB/hour",
    dataTransferred,
    timeElapsed: hoursElapsed,
  };
}
