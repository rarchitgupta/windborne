"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import type { LocationPoint } from "@/lib/queries/location-data";
import { scaleLinear } from "d3-scale";
import { useCsvData } from "@/lib/queries/csv-data";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Props = {
  points?: LocationPoint[];
  dataset?: "food" | "water" | "vulnerability";
};

export default function WorldMap({ points, dataset }: Props) {
  const csvQuery = dataset ? useCsvData(dataset) : null;
  const csv = csvQuery?.data ?? [];

  // pick last numeric column (skip ISO3/Name)
  let yearKey: string | null = null;
  if (csv.length > 0) {
    const keys = Object.keys(csv[0]).filter(
      (k) => k !== "ISO3" && k !== "Name"
    );
    if (keys.length > 0) yearKey = keys[keys.length - 1];
  }

  // compute domain from data for the selected yearKey
  let domainMin = 0;
  let domainMax = 1;
  if (yearKey) {
    domainMin = Number.POSITIVE_INFINITY;
    domainMax = Number.NEGATIVE_INFINITY;
    for (const r of csv) {
      const v = Number(r[yearKey]);
      if (!Number.isFinite(v)) continue;
      if (v < domainMin) domainMin = v;
      if (v > domainMax) domainMax = v;
    }
    if (!Number.isFinite(domainMin) || !Number.isFinite(domainMax)) {
      domainMin = 0;
      domainMax = 1;
    }
  }

  // dataset-specific color ranges
  let colorRange: [string, string] = ["#ffedea", "#ff5233"]; // default red (vulnerability)
  if (dataset === "food") colorRange = ["#fff9db", "#ffd54f"]; // yellow-ish
  if (dataset === "water") colorRange = ["#e6f7ff", "#2b8cff"]; // blue-ish

  // Avoid generic typing confusion inside TSX: coerce the d3 scale to `any`
  const _linear: any = scaleLinear();
  const scale = _linear
    .domain([domainMin, domainMax])
    .range([colorRange[0], colorRange[1]]) as unknown as (v: number) => string;

  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Graticule stroke="#CCCCCC" strokeWidth={0.4} />

          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  // Try matching CSV rows to the geography. TopoJSON features sometimes
                  // only carry a numeric `id` (see logs like id: '242'), so we attempt
                  // several strategies in order:
                  // 1) ISO3 fields on geo.properties (ISO_A3, iso_a3, ADM0_A3)
                  // 2) CSV ISO3 fields (ISO3 / ISO_3 / iso3)
                  // 3) Fallback: match by normalized country name against CSV Name
                  const geoName =
                    (geo.properties &&
                      (geo.properties.name || geo.properties.NAME || "")) ||
                    "";
                  const isoFromProps =
                    (geo.properties &&
                      (geo.properties.ISO_A3 ||
                        geo.properties.iso_a3 ||
                        geo.properties.ADM0_A3)) ||
                    null;

                  const normalize = (s: unknown) =>
                    String(s || "")
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "")
                      .trim();

                  // First, try to find a row by ISO3 (if available on the geo)
                  let row = null as any | null;
                  if (isoFromProps) {
                    row =
                      csv.find((s) => {
                        const sIso = String(
                          s["ISO3"] || s["ISO_3"] || s["iso3"] || ""
                        ).trim();
                        return sIso !== "" && sIso === String(isoFromProps);
                      }) || null;
                  }

                  // If we didn't find a row yet, try matching by normalized name.
                  // Make name matching tolerant: consider exact normalized match or
                  // substring matches so names like "United States of America"
                  // will match CSV "United States".
                  if (!row && geoName) {
                    const gNorm = normalize(geoName);
                    row =
                      csv.find((s) => {
                        const sName = String(s["Name"] || s["name"] || "");
                        if (!sName) return false;
                        const sNorm = normalize(sName);
                        return (
                          sNorm === gNorm ||
                          gNorm.includes(sNorm) ||
                          sNorm.includes(gNorm)
                        );
                      }) || null;
                  }

                  // Also, as a last resort, try matching CSV ISO to geo.id if geo.id is already a 3-letter code
                  if (!row && geo.id) {
                    const idStr = String(geo.id);
                    row =
                      csv.find((s) => {
                        const sIso = String(
                          s["ISO3"] || s["ISO_3"] || s["iso3"] || ""
                        ).trim();
                        return sIso !== "" && sIso === idStr;
                      }) || null;
                  }

                  const iso = isoFromProps || String(geo.id || "");
                  const valueRaw = yearKey ? row?.[yearKey] : undefined;
                  const valueNum =
                    valueRaw != null && valueRaw !== ""
                      ? Number(valueRaw)
                      : NaN;
                  const fill =
                    row && yearKey && Number.isFinite(valueNum)
                      ? scale(valueNum)
                      : "#F5F4F6";
                  // debug log removed
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#D1D5DB"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#cbd5e1" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })}
              </>
            )}
          </Geographies>

          {points && points.length > 0 && (
            <g>
              {points.map((p, i) => (
                <Marker key={`pt-${i}`} coordinates={[p.lon, p.lat]}>
                  <circle
                    r={2}
                    fill="#ff7a00"
                    stroke="#ffffff"
                    strokeWidth={0.5}
                  />
                  <title>{`lat: ${p.lat.toFixed(5)}, lon: ${p.lon.toFixed(5)}${
                    p.alt != null ? `, alt: ${p.alt}` : ""
                  }`}</title>
                </Marker>
              ))}
            </g>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
