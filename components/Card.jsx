export function Card({ title, children }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}
