/**
 * Minimal CSV helpers — no external dependency.
 * Escaping follows RFC 4180: fields containing quotes, commas, or newlines
 * are wrapped in double quotes with internal quotes doubled.
 */

function escapeField(value: string): string {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function toCSV(headers: string[], rows: string[][]): string {
  // BOM so Excel opens the file with correct encoding
  const lines = [headers.map(escapeField).join(",")];
  for (const row of rows) {
    lines.push(row.map(cell => escapeField(cell ?? "")).join(","));
  }
  return "\uFEFF" + lines.join("\r\n");
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
