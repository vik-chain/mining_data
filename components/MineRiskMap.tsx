"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { AccidentRecord } from "@/lib/csvLoader";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type StateStats = { accidents: number; fatals: number; score: number };

const STATE_ABBR_TO_NAME: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const STATE_NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ABBR_TO_NAME).map(([abbr, name]) => [name, abbr])
);

function aggregateByState(records: AccidentRecord[]): Record<string, StateStats> {
  const raw: Record<string, { accidents: number; fatals: number }> = {};
  records.forEach((r) => {
    const abbr = r.state?.trim().toUpperCase();
    if (!abbr || abbr.length !== 2) return;
    if (!raw[abbr]) raw[abbr] = { accidents: 0, fatals: 0 };
    raw[abbr].accidents++;
    if (r.fatal) raw[abbr].fatals++;
  });
  const scored = Object.entries(raw).map(([abbr, s]) => ({
    abbr, ...s, rawScore: s.accidents * 0.7 + s.fatals * 5,
  }));
  const max = Math.max(...scored.map((s) => s.rawScore), 1);
  const result: Record<string, StateStats> = {};
  scored.forEach(({ abbr, accidents, fatals, rawScore }) => {
    result[abbr] = { accidents, fatals, score: (rawScore / max) * 100 };
  });
  return result;
}

function interpolateColor(score: number): string {
  const t = Math.max(0, Math.min(score / 100, 1));
  const r = Math.round(17 + (249 - 17) * t);
  const g = Math.round(17 + (115 - 17) * t);
  const b = Math.round(17 + (22 - 17) * t);
  return `rgb(${r},${g},${b})`;
}

type Tooltip = { stateName: string; stats: StateStats | null; x: number; y: number } | null;

export default function MineRiskMap({ records }: { records: AccidentRecord[] }) {
  const [tooltip, setTooltip] = useState<Tooltip>(null);

  const stateData = useMemo(() => aggregateByState(records), [records]);

  return (
    <section
      id="map"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "8vh",
        paddingBottom: "4vh",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="content-wrap">
        <p className="section-label section-fade" style={{ marginBottom: "24px" }}>
          04 — Mine Risk by State
        </p>

        <p
          className="section-fade"
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 300,
            color: "#f5f5f5",
            lineHeight: 1.2,
            marginBottom: "48px",
            maxWidth: "680px",
          }}
        >
          Risk isn&apos;t evenly distributed.
        </p>

        {/* Map */}
        <div className="section-fade" style={{ position: "relative", marginBottom: "32px", maxHeight: "460px", overflow: "hidden" }}>
          <ComposableMap
            projection="geoAlbersUsa"
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.name as string;
                  const abbr = STATE_NAME_TO_ABBR[stateName];
                  const stats = abbr ? stateData[abbr] : null;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={stats ? interpolateColor(stats.score) : "#111111"}
                      stroke="#0a0a0a"
                      strokeWidth={0.5}
                      onMouseEnter={(evt) =>
                        setTooltip({ stateName, stats, x: evt.clientX, y: evt.clientY })
                      }
                      onMouseMove={(evt) =>
                        setTooltip((p) => (p ? { ...p, x: evt.clientX, y: evt.clientY } : null))
                      }
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", opacity: 0.8 },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div
          className="section-fade"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <span style={{ color: "#555", fontSize: "11px", letterSpacing: "0.08em" }}>No data</span>
          <div
            style={{
              flex: 1,
              maxWidth: "240px",
              height: "6px",
              borderRadius: "3px",
              background: "linear-gradient(to right, #111111, #f97316)",
            }}
          />
          <span style={{ color: "#f97316", fontSize: "11px", letterSpacing: "0.08em" }}>Highest risk</span>
        </div>

        <p
          className="section-fade"
          style={{ color: "#333", fontSize: "12px", letterSpacing: "0.04em" }}
        >
          ~25% of records have no state field and are excluded. Risk score = accidents × 0.7 + fatalities × 5, normalized to 100.
        </p>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 16,
            left: tooltip.x + 16,
            background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "14px 18px",
            pointerEvents: "none",
            zIndex: 200,
            minWidth: "180px",
          }}
        >
          <p style={{ color: "#f5f5f5", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>
            {tooltip.stateName}
          </p>
          {tooltip.stats ? (
            <>
              <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>
                Accidents: <span style={{ color: "#f5f5f5" }}>{tooltip.stats.accidents.toLocaleString()}</span>
              </p>
              <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>
                Fatalities: <span style={{ color: "#f97316" }}>{tooltip.stats.fatals.toLocaleString()}</span>
              </p>
              <p style={{ color: "#888", fontSize: "12px" }}>
                Risk score: <span style={{ color: "#f97316" }}>{tooltip.stats.score.toFixed(1)}</span>
              </p>
            </>
          ) : (
            <p style={{ color: "#555", fontSize: "12px" }}>No data available</p>
          )}
        </div>
      )}
    </section>
  );
}
