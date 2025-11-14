import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const windborne_url = "/api/treasure/";

export type RawPoint = [number, number, number?];
export type LocationPoint = { lat: number; lon: number; alt?: number | null };

async function fetchHourData(hour: number): Promise<LocationPoint[]> {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error("hour must be an integer between 0 and 23");
  }
  const hh = hour.toString().padStart(2, "0");
  // Use local proxy API to avoid CORS issues when fetching from the browser
  const url = `${windborne_url}${hh}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    // Try parse JSON directly first
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // Attempt lightweight repair: extract first top-level array
      const first = text.indexOf("[");
      const last = text.lastIndexOf("]");
      if (first !== -1 && last !== -1 && last > first) {
        const sub = text.slice(first, last + 1);
        try {
          parsed = JSON.parse(sub);
        } catch (err2) {
          // fall through to throwing below
        }
      }
    }
    if (!Array.isArray(parsed)) return [];
    const out: LocationPoint[] = [];
    for (const item of parsed) {
      if (!Array.isArray(item) || item.length < 2) continue;
      // API appears to return [lon, lat, alt]
      const lon = Number(item[0]);
      const lat = Number(item[1]);
      const alt =
        item.length > 2
          ? isFinite(Number(item[2]))
            ? Number(item[2])
            : null
          : null;
      if (!isFinite(lat) || !isFinite(lon)) continue;
      out.push({ lat, lon, alt });
    }
    return out;
  } catch (err) {
    // On any error return empty array so UI can handle gracefully
    return [];
  }
}

/**
 * React Query hook: useLocationHour
 * - hour: integer 0..23 where 0 => current, 1 => 1 hour ago, ...
 * - options: forwarded to useQuery
 */
export function useLocationHour(
  hour: number,
  options?: UseQueryOptions<LocationPoint[], Error>
) {
  return useQuery<LocationPoint[], Error>({
    queryKey: ["balloon-locations", hour],
    queryFn: async () => fetchHourData(hour),
    // small staleTime to avoid immediate refetch on client mount
    staleTime: 60_000,
    retry: 1,
    ...options,
  });
}

export { fetchHourData };
