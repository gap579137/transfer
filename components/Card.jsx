export function Card({ title, children }) {
  return (
    <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}
