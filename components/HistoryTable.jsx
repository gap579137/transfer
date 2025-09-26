import { fmtDate } from "../utils";

export function HistoryTable({ snapshotHistory }) {
  if (!snapshotHistory || snapshotHistory.length === 0) {
    return (
      <div className="p-4 text-center text-sm opacity-75">
        No history yet. Update snapshot values to see transfer history.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-2 font-medium">Time</th>
            <th className="text-left p-2 font-medium">Snapshot</th>
            <th className="text-right p-2 font-medium">Total (TB)</th>
            <th className="text-right p-2 font-medium">Free (TB)</th>
            <th className="text-right p-2 font-medium">Used (TB)</th>
          </tr>
        </thead>
        <tbody>
          {snapshotHistory.map((entry) => (
            <tr key={entry.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{fmtDate(entry.createdAt)}</td>
              <td className="p-2">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {entry.snapshotName}
                </span>
              </td>
              <td className="text-right p-2">{entry.total.toFixed(2)}</td>
              <td className="text-right p-2">{entry.free.toFixed(2)}</td>
              <td className="text-right p-2">{entry.used.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
