import { useCallback, useEffect, useState } from "react";

export function useTransferSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/sessions");
      if (!response.ok) throw new Error("Failed to fetch session");
      const data = await response.json();
      setSession(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching session:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSession = useCallback(async (updates) => {
    try {
      setError(null);
      const response = await fetch("/api/sessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update session");
      const data = await response.json();
      setSession(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error updating session:", err);
      throw err;
    }
  }, []);

  const updateSnapshot = useCallback(
    async (snapshotId, updates) => {
      try {
        setError(null);
        const response = await fetch("/api/snapshots", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: snapshotId, ...updates }),
        });
        if (!response.ok) throw new Error("Failed to update snapshot");

        // Refresh the session to get updated data
        await fetchSession();
      } catch (err) {
        setError(err.message);
        console.error("Error updating snapshot:", err);
        throw err;
      }
    },
    [fetchSession],
  );

  const addJob = useCallback(
    async (jobData) => {
      try {
        setError(null);
        if (!session) throw new Error("No session available");

        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.id, ...jobData }),
        });
        if (!response.ok) throw new Error("Failed to add job");

        // Refresh the session to get updated data
        await fetchSession();
      } catch (err) {
        setError(err.message);
        console.error("Error adding job:", err);
        throw err;
      }
    },
    [session, fetchSession],
  );

  const removeJob = useCallback(
    async (jobId) => {
      try {
        setError(null);
        const response = await fetch(`/api/jobs?id=${jobId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove job");

        // Refresh the session to get updated data
        await fetchSession();
      } catch (err) {
        setError(err.message);
        console.error("Error removing job:", err);
        throw err;
      }
    },
    [fetchSession],
  );

  // Initial load
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    loading,
    error,
    updateSession,
    updateSnapshot,
    addJob,
    removeJob,
    refetch: fetchSession,
  };
}
