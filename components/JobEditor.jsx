"use client";

import { useState } from "react";

export function JobEditor({ jobs, setJobs }) {
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      add();
    }
  };

  return (
    <div>
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          className="rounded-xl border p-2"
          placeholder="Job name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          className="rounded-xl border p-2"
          placeholder="Start time (e.g., 17:55)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          className="rounded-xl border px-4 py-2 hover:bg-gray-50 transition-colors"
          onClick={add}
        >
          Add job
        </button>
      </div>
      <div className="divide-y rounded-xl border">
        {(jobs || []).length === 0 ? (
          <div className="p-3 text-sm opacity-75">No jobs yet.</div>
        ) : (
          jobs.map((j, i) => (
            <div
              key={`job-${j.name}-${i}`}
              className="flex items-center justify-between p-3"
            >
              <div>
                <div className="text-sm font-medium">
                  {j.name || "(untitled)"}
                </div>
                {j.time && (
                  <div className="text-xs opacity-75">Start: {j.time}</div>
                )}
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:text-red-800 transition-colors"
                onClick={() => remove(i)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
