import { Card } from "./Card.jsx";
import { NumberRow } from "./NumberRow.jsx";

export function SnapshotCard({ title, snapshot, onChange, derivedPercent }) {
  return (
    <Card title={title}>
      <NumberRow
        label="Total"
        value={snapshot.total}
        onChange={(v) => onChange({ ...snapshot, total: v })}
      />
      <NumberRow
        label="Free"
        value={snapshot.free}
        onChange={(v) => onChange({ ...snapshot, free: v })}
      />
      <NumberRow
        label="Used"
        value={snapshot.used}
        onChange={(v) => onChange({ ...snapshot, used: v })}
      />
      {derivedPercent !== undefined && (
        <div className="mt-2 text-sm opacity-75">
          Derived % from snapshots:{" "}
          {derivedPercent ? `${derivedPercent.toFixed(2)}%` : "—"}
        </div>
      )}
    </Card>
  );
}
