const show = (value: unknown) =>
  value === null || value === undefined ? "—" : String(value);

export function summarizeChange(
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null,
) {
  if (newValue) {
    return Object.entries(newValue)
      .map(([key, value]) =>
        oldValue && key in oldValue
          ? `${key}: ${show(oldValue[key])} → ${show(value)}`
          : `${key}: ${show(value)}`,
      )
      .join(", ");
  }
  if (oldValue) {
    return Object.entries(oldValue)
      .map(([key, value]) => `${key}: ${show(value)}`)
      .join(", ");
  }
  return "—";
}
