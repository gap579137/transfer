"use client";

import { useState } from "react";

export function JobEditor({ jobs, onAdd, onRemove }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const add = async () => {
    if (!name.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onAdd({ name: name.trim(), startTime: time.trim() });
      setName("");
      setTime("");
    } catch (error) {
      console.error("Failed to add job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (jobId) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onRemove(jobId);
    } catch (error) {
      console.error("Failed to remove job:", error);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        />
        <input
          className="rounded-xl border p-2"
          placeholder="Start time (e.g., 17:55)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          type="button"
          className="rounded-xl border px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={add}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add job"}
        </button>
      </div>
      <div className="divide-y rounded-xl border">
        {(jobs || []).length === 0 ? (
          <div className="p-3 text-sm opacity-75">No jobs yet.</div>
        ) : (
          jobs.map((j) => (
            <div
              key={j.id || `job-${j.name}`}
              className="flex items-center justify-between p-3"
            >
              <div>
                <div className="text-sm font-medium">
                  {j.name || "(untitled)"}
                </div>
                {j.startTime && (
                  <div className="text-xs opacity-75">Start: {j.startTime}</div>
                )}
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                onClick={() => remove(j.id)}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Remove"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
