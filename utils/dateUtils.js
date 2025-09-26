function pad(n) {
  return n.toString().padStart(2, "0");
}

export function toLocalDateTimeValue(d) {
  if (!d) return "";
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const MM = pad(dt.getMonth() + 1);
  const DD = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  return `${yyyy}-${MM}-${DD}T${hh}:${mm}`;
}

export function fromLocalDateTimeValue(v) {
  if (!v) return null;
  return new Date(v);
}

export function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(d));
  } catch {
    return String(d);
  }
}
