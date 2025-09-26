export function Stat({ label, value, highlight = false }) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-xl px-3 py-2">
      <div className="text-sm opacity-75">{label}</div>
      <div
        className={`text-sm font-medium ${highlight ? "text-blue-600 font-semibold" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
