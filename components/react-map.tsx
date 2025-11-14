"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap() {
  return (
    // Use flex sizing so this component fills the remaining space when its
    // parent is a column flex container. `min-h-0` is important so children
    // can shrink properly inside overflow-hidden flex parents.
    <div className="w-full h-[1250px] flex items-center justify-center">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 150 }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* Graticule (grid lines) */}
        <Graticule stroke="#CCCCCC" strokeWidth={0.4} />

        {/* Countries */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#E5E7EB" // light neutral grey
                stroke="#D1D5DB" // faint border
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#D1D5DB" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
