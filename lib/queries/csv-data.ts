import { useQuery } from "@tanstack/react-query";

export type CsvRow = Record<string, string>;

async function fetchCsv(path: string): Promise<CsvRow[]> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const text = await res.text();
  // Simple CSV parse (handles quoted fields). Avoid requiring d3-dsv
  // so this works during development without adding dependencies.
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const split = (line: string) => line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  const headers = split(lines[0]).map((h) => h.replace(/^"|"$/g, ""));
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = split(lines[i]);
    if (cols.length === 0) continue;
    const obj: CsvRow = {};
    for (let j = 0; j < headers.length; j++) {
      const raw = cols[j] ?? "";
      const val = raw.replace(/^"|"$/g, "").replace(/""/g, '"');
      obj[headers[j]] = val;
    }
    rows.push(obj);
  }
  return rows;
}

export function useCsvData(name: "food" | "water" | "vulnerability") {
  const path = `/api/csv/${name}`;
  return useQuery<CsvRow[], Error>({
    queryKey: ["csv", name],
    queryFn: () => fetchCsv(path),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
