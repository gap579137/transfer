export function NumberRow({ label, value, onChange, readOnly = false }) {
  return (
    <div className="mb-3 grid grid-cols-2 items-center gap-3">
      <div className="text-sm">{label}</div>
      {readOnly ? (
        <div className="w-full rounded-xl border p-2 bg-gray-50">{value}</div>
      ) : (
        <input
          className="w-full rounded-xl border p-2"
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
