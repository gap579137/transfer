import { useState } from "react";
import { Card } from "./Card.jsx";
import FreeSpaceModal from "./FreeSpaceModal.jsx";
import { NumberRow } from "./NumberRow.jsx";

export function SnapshotCard({
  title,
  snapshot,
  onChange,
  derivedPercent,
  allowFreeSpaceEdit = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFreeSpaceUpdate = async (updates) => {
    setIsUpdating(true);
    try {
      await onChange(updates);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card title={title}>
        <NumberRow label="Total" value={snapshot.total} readOnly={true} />
        <NumberRow label="Free" value={snapshot.free} readOnly={true} />
        <NumberRow
          label="Used"
          value={snapshot.used.toFixed(2)}
          readOnly={true}
        />

        {allowFreeSpaceEdit && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-xl border px-4 py-2 shadow hover:bg-gray-50 transition-colors text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Free Space"}
            </button>
          </div>
        )}

        {derivedPercent !== undefined && (
          <div className="mt-2 text-sm opacity-75">
            Derived % from snapshots:{" "}
            {derivedPercent ? `${derivedPercent.toFixed(2)}%` : "—"}
          </div>
        )}
      </Card>

      {allowFreeSpaceEdit && (
        <FreeSpaceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentFree={snapshot.free}
          totalSpace={snapshot.total}
          onUpdate={handleFreeSpaceUpdate}
          isLoading={isUpdating}
        />
      )}
    </>
  );
}
