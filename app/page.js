"use client";

import { useMemo } from "react";
import { Card, JobEditor, SnapshotCard, Stat } from "../components";
import {
  calculateElapsedTime,
  calculateETA,
  calculatePercentFromSnapshots,
  calculateRemainingTime,
  fmtDate,
  formatPercentDisplay,
  getEffectivePercent,
  toLocalDateTimeValue,
  useLocalStorage,
} from "../utils";

export default function App() {
  const [snap1, setSnap1] = useLocalStorage("eta.snap1", {
    total: 59.9,
    free: 29.5,
    used: 30.4,
  });
  const [snap2, setSnap2] = useLocalStorage("eta.snap2", {
    total: 59.9,
    free: 56.8,
    used: 3.1,
  });
  const [percentManual, setPercentManual] = useLocalStorage(
    "eta.percentManual",
    9.54,
  );
  const [startTime, setStartTime] = useLocalStorage("eta.startTime", "");
  const [currentTime, setCurrentTime] = useLocalStorage("eta.currentTime", "");
  const [lastUpdated, setLastUpdated] = useLocalStorage(
    "eta.lastUpdated",
    null,
  );
  const [jobList, setJobList] = useLocalStorage("eta.jobs", [
    { name: "Backup job", time: "17:55" },
  ]);

  const pctFromSnapshots = useMemo(
    () => calculatePercentFromSnapshots(snap1, snap2),
    [snap1, snap2],
  );

  const effectivePercent = useMemo(
    () => getEffectivePercent(percentManual, pctFromSnapshots),
    [percentManual, pctFromSnapshots],
  );

  const eta = useMemo(
    () => calculateETA(startTime, currentTime, effectivePercent),
    [startTime, currentTime, effectivePercent],
  );

  const remaining = useMemo(
    () => calculateRemainingTime(eta, currentTime),
    [eta, currentTime],
  );

  const elapsedStr = useMemo(
    () => calculateElapsedTime(startTime, currentTime),
    [startTime, currentTime],
  );

  const percentDisplay = useMemo(
    () => formatPercentDisplay(effectivePercent),
    [effectivePercent],
  );

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Copy Progress → ETA
          </h1>
          <div className="text-sm opacity-75">
            Last updated: {fmtDate(lastUpdated)}
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <SnapshotCard
            title="Snapshot A"
            snapshot={snap1}
            onChange={setSnap1}
          />
          <SnapshotCard
            title="Snapshot B"
            snapshot={snap2}
            onChange={setSnap2}
            derivedPercent={pctFromSnapshots}
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="Progress & Timing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-1 block text-sm font-medium"
                >
                  Start time
                </label>
                <input
                  id="startTime"
                  className="w-full rounded-xl border p-2"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="currentTime"
                  className="mb-1 block text-sm font-medium"
                >
                  Current time
                </label>
                <div className="flex gap-2">
                  <input
                    id="currentTime"
                    className="w-full rounded-xl border p-2"
                    type="datetime-local"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                  />
                  <button
                    type="button"
                    className="rounded-xl border px-3 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      setCurrentTime(toLocalDateTimeValue(new Date()))
                    }
                    title="Set to now"
                  >
                    Now
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="percentManual"
                  className="mb-1 block text-sm font-medium"
                >
                  Current % done (manual)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="percentManual"
                    className="w-full rounded-xl border p-2"
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={percentManual || ""}
                    onChange={(e) => setPercentManual(e.target.value)}
                  />
                  <span className="text-xs opacity-75">
                    or use derived above
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="stampButton"
                  className="mb-1 block text-sm font-medium"
                >
                  Mark last updated
                </label>
                <button
                  type="button"
                  id="stampButton"
                  className="w-full rounded-xl border px-4 py-2 shadow hover:bg-gray-50 transition-colors"
                  onClick={() => setLastUpdated(new Date().toISOString())}
                >
                  Stamp Now
                </button>
              </div>
            </div>
          </Card>

          <Card title="ETA & Stats">
            <Stat label="Elapsed" value={elapsedStr} />
            <Stat label="Percent complete" value={percentDisplay} />
            <Stat label="Remaining (est)" value={remaining} />
            <Stat label="Estimated completion" value={fmtDate(eta)} highlight />
          </Card>
        </div>

        <div className="mt-6">
          <Card title="Jorge's Jobs">
            <JobEditor jobs={jobList} setJobs={setJobList} />
          </Card>
        </div>

        <div className="mt-8 text-center text-xs opacity-75">
          Built for quick operational tracking. Values persist locally in your
          browser.
        </div>
      </div>
    </div>
  );
}
