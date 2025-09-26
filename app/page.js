'use client'

import React, { useEffect, useMemo, useState } from "react";

function pad(n) {
  return n.toString().padStart(2, "0");
}

function toLocalDateTimeValue(d) {
  if (!d) return "";
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const MM = pad(dt.getMonth() + 1);
  const DD = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  return `${yyyy}-${MM}-${DD}T${hh}:${mm}`;
}

function fromLocalDateTimeValue(v) {
  if (!v) return null;
  return new Date(v);
}

function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(d));
  } catch {
    return String(d);
  }
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

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
  const [percentManual, setPercentManual] = useLocalStorage("eta.percentManual", 9.54);
const [startTime, setStartTime] = useLocalStorage("eta.startTime", null);
const [currentTime, setCurrentTime] = useLocalStorage("eta.currentTime", null);
const [lastUpdated, setLastUpdated] = useLocalStorage("eta.lastUpdated", null);
  const [jobList, setJobList] = useLocalStorage("eta.jobs", [
    { name: "Backup job", time: "17:55" },
  ]);

  const pctFromSnapshots = useMemo(() => {
    const t = Number(snap1.total) || 0;
    const u1 = Number(snap1.used) || 0;
    const u2 = Number(snap2.used) || 0;
    if (t <= 0) return null;
    const delta = Math.max(0, u1 - u2);
    const pct = (delta / t) * 100;
    if (!isFinite(pct) || pct <= 0) return null;
    return pct;
  }, [snap1, snap2]);

  const effectivePercent = useMemo(() => {
    const m = Number(percentManual);
    if (isFinite(m) && m > 0 && m <= 100) return m;
    return pctFromSnapshots ?? 0;
  }, [percentManual, pctFromSnapshots]);

  const eta = useMemo(() => {
    const start = fromLocalDateTimeValue(startTime);
    const curr = fromLocalDateTimeValue(currentTime);
    const p = Number(effectivePercent) / 100;
    if (!start || !curr || !(p > 0 && p <= 1)) return null;
    const elapsedMs = curr.getTime() - start.getTime();
    if (elapsedMs <= 0) return null;
    const totalMs = elapsedMs / p;
    const remainingMs = totalMs - elapsedMs;
    return new Date(curr.getTime() + remainingMs);
  }, [startTime, currentTime, effectivePercent]);

  const remaining = useMemo(() => {
    if (!eta) return "—";
    const curr = fromLocalDateTimeValue(currentTime);
    const ms = eta.getTime() - curr.getTime();
    if (!isFinite(ms) || ms < 0) return "—";
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.round((ms % 3_600_000) / 60_000);
    return `${hours}h ${minutes}m`;
  }, [eta, currentTime]);

  const elapsedStr = useMemo(() => {
    const start = fromLocalDateTimeValue(startTime);
    const curr = fromLocalDateTimeValue(currentTime);
    if (!start || !curr) return "—";
    const ms = Math.max(0, curr.getTime() - start.getTime());
    const h = Math.floor(ms / 3_600_000);
    const m = Math.round((ms % 3_600_000) / 60_000);
    return `${h}h ${m}m`;
  }, [startTime, currentTime]);

  const percentDisplay = useMemo(() => {
    const v = Number(effectivePercent);
    return isFinite(v) && v > 0 ? v.toFixed(2) + "%" : "—";
  }, [effectivePercent]);

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Copy Progress → ETA</h1>
          <div className="text-sm opacity-75">Last updated: {fmtDate(lastUpdated)}</div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Snapshot A">
            <NumberRow label="Total" value={snap1.total} onChange={(v) => setSnap1({ ...snap1, total: v })} />
            <NumberRow label="Free" value={snap1.free} onChange={(v) => setSnap1({ ...snap1, free: v })} />
            <NumberRow label="Used" value={snap1.used} onChange={(v) => setSnap1({ ...snap1, used: v })} />
          </Card>
          <Card title="Snapshot B">
            <NumberRow label="Total" value={snap2.total} onChange={(v) => setSnap2({ ...snap2, total: v })} />
            <NumberRow label="Free" value={snap2.free} onChange={(v) => setSnap2({ ...snap2, free: v })} />
            <NumberRow label="Used" value={snap2.used} onChange={(v) => setSnap2({ ...snap2, used: v })} />
            <div className="mt-2 text-sm opacity-75">
              Derived % from snapshots: {pctFromSnapshots ? pctFromSnapshots.toFixed(2) + "%" : "—"}
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="Progress & Timing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Start time</label>
                <input
                  className="w-full rounded-xl border p-2"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Current time</label>
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-xl border p-2"
                    type="datetime-local"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                  />
                  <button
                    className="rounded-xl border px-3 text-sm"
                    onClick={() => setCurrentTime(toLocalDateTimeValue(new Date()))}
                    title="Set to now"
                  >Now</button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Current % done (manual)</label>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-xl border p-2"
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={percentManual}
                    onChange={(e) => setPercentManual(e.target.value)}
                  />
                  <span className="text-xs opacity-75">or use derived above</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Mark last updated</label>
                <button
                  className="w-full rounded-xl border px-4 py-2 shadow"
                  onClick={() => setLastUpdated(new Date().toISOString())}
                >Stamp Now</button>
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
          Built for quick operational tracking. Values persist locally in your browser.
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}

function NumberRow({ label, value, onChange }) {
  return (
    <div className="mb-3 grid grid-cols-2 items-center gap-3">
      <div className="text-sm">{label}</div>
      <input
        className="w-full rounded-xl border p-2"
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Stat({ label, value, highlight = false }) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-xl px-3 py-2">
      <div className="text-sm opacity-75">{label}</div>
      <div className={`text-sm font-medium ${highlight ? "" : ""}`}>{value}</div>
    </div>
  );
}

function JobEditor({ jobs, setJobs }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const add = () => {
    if (!name.trim()) return;
    setJobs([...(jobs || []), { name: name.trim(), time: time.trim() }]);
    setName("");
    setTime("");
  };

  const remove = (idx) => {
    const next = [...jobs];
    next.splice(idx, 1);
    setJobs(next);
  };

  return (
    <div>
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          className="rounded-xl border p-2"
          placeholder="Job name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-xl border p-2"
          placeholder="Start time (e.g., 17:55)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button className="rounded-xl border px-4 py-2" onClick={add}>Add job</button>
      </div>
      <div className="divide-y rounded-xl border">
        {(jobs || []).length === 0 ? (
          <div className="p-3 text-sm opacity-75">No jobs yet.</div>
        ) : (
          jobs.map((j, i) => (
            <div key={i} className="flex items-center justify-between p-3">
              <div>
                <div className="text-sm font-medium">{j.name || "(untitled)"}</div>
                {j.time && <div className="text-xs opacity-75">Start: {j.time}</div>}
              </div>
              <button className="text-xs" onClick={() => remove(i)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}