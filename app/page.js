"use client";

import { useMemo } from "react";
import {
  Card,
  HistoryTable,
  JobEditor,
  SnapshotCard,
  Stat,
} from "../components";
import { useTransferSession } from "../hooks";
import {
  calculatePercentFromSnapshots,
  calculateTransferSpeed,
  fmtDate,
  toLocalDateTimeValue,
} from "../utils";

export default function App() {
  const {
    session,
    loading,
    error,
    updateSession,
    updateSnapshot,
    addJob,
    removeJob,
  } = useTransferSession();

  // Extract data from session (with defaults for hooks)
  const snapshots = session?.snapshots || [];
  const snap1 = snapshots.find((s) => s.name === "A") || {
    total: 0,
    free: 0,
    used: 0,
  };
  const snap2 = snapshots.find((s) => s.name === "B") || {
    total: 0,
    free: 0,
    used: 0,
  };
  const jobList = session?.jobs || [];
  const snapshotHistory = session?.snapshotHistory || [];
  const startTime = session?.startTime
    ? toLocalDateTimeValue(session.startTime)
    : "";
  const lastUpdated = session?.lastUpdated;

  // Calculations (must be called unconditionally)
  const pctFromSnapshots = useMemo(
    () => calculatePercentFromSnapshots(snap1, snap2),
    [snap1, snap2],
  );

  const transferSpeed = useMemo(
    () => calculateTransferSpeed(snapshotHistory, "B"),
    [snapshotHistory],
  );

  // Event handlers
  const handleSessionUpdate = async (updates) => {
    try {
      await updateSession(updates);
    } catch (err) {
      console.error("Failed to update session:", err);
    }
  };

  const handleSnapshotUpdate = async (snapshotId, updates) => {
    try {
      await updateSnapshot(snapshotId, updates);
    } catch (err) {
      console.error("Failed to update snapshot:", err);
    }
  };

  // Early returns for loading/error states (after hooks)
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-sm opacity-75">Fetching transfer data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-xl font-semibold mb-2">Error</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">No Session</div>
          <div className="text-sm opacity-75">
            Unable to load transfer session
          </div>
        </div>
      </div>
    );
  }

  console.log("Transfer History:", snapshotHistory);

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Transfer Progress
          </h1>
          <div className="text-sm opacity-75">
            Last updated: {fmtDate(snapshotHistory[0]?.createdAt) || "—"}
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <SnapshotCard
            title="Snapshot A"
            snapshot={snap1}
            onChange={(updatedSnapshot) =>
              handleSnapshotUpdate(snap1.id, updatedSnapshot)
            }
          />
          <SnapshotCard
            title="Snapshot B"
            snapshot={snap2}
            onChange={(updatedSnapshot) =>
              handleSnapshotUpdate(snap2.id, updatedSnapshot)
            }
            derivedPercent={pctFromSnapshots}
            allowFreeSpaceEdit={true}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card title="Transfer Details">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-1 block text-sm font-medium"
                >
                  Start time
                </label>
                {session?.startTime ? (
                  // Read-only display when start time is already set
                  <div className="w-full rounded-xl border p-2 bg-gray-50 text-gray-700">
                    {fmtDate(session.startTime)}
                  </div>
                ) : (
                  // Editable input when no start time is set
                  <input
                    id="startTime"
                    className="w-full rounded-xl border p-2"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) =>
                      handleSessionUpdate({ startTime: e.target.value })
                    }
                  />
                )}
                {session?.startTime && (
                  <div className="mt-1 text-xs text-gray-600">
                    Start time is locked once set
                  </div>
                )}
              </div>
              {!session?.startTime && (
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
                    onClick={() =>
                      handleSessionUpdate({
                        lastUpdated: new Date().toISOString(),
                      })
                    }
                  >
                    Stamp Now
                  </button>
                </div>
              )}
            </div>
          </Card>

          <Card title="Transfer Stats">
            <div className="space-y-3">
              <Stat
                label="Data transferred"
                value={
                  pctFromSnapshots ? `${pctFromSnapshots.toFixed(2)}%` : "—"
                }
              />
              <Stat
                label="Transfer speed"
                value={
                  transferSpeed
                    ? `${transferSpeed.speed.toFixed(2)} ${transferSpeed.unit}`
                    : "—"
                }
              />
              <Stat
                label="Data amount (B)"
                value={`${snap2.used.toFixed(2)} TB`}
              />
              <Stat
                label="Start time"
                value={session?.startTime ? fmtDate(session.startTime) : "—"}
              />
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="Jorge's Jobs">
            <JobEditor jobs={jobList} onAdd={addJob} onRemove={removeJob} />
          </Card>
        </div>

        <div className="mt-6">
          <Card title="Transfer History">
            <HistoryTable snapshotHistory={snapshotHistory} />
          </Card>
        </div>

        <div className="mt-8 text-center text-xs opacity-75">
          Built for quick operational tracking. Values persist in database.
        </div>
      </div>
    </div>
  );
}
