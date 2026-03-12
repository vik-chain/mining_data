"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AccidentRecord } from "@/lib/csvLoader";

const ACCIDENT_SCENARIOS: Record<string, string[]> = {
  "Powered Haulage": [
    "Haul truck backing over worker",
    "Runaway vehicle on grade",
    "Pinch point between haulage units",
  ],
  "Fall of Ground": [
    "Unsupported roof collapse",
    "Rib failure in mine opening",
    "Highwall failure at surface cut",
  ],
  Machinery: [
    "Worker caught in conveyor belt",
    "Rotating equipment entanglement",
    "Hydraulic line failure",
  ],
  Electrical: [
    "Arc flash from energized equipment",
    "Electrocution via faulty wiring",
    "Contact with overhead lines",
  ],
  Explosive: [
    "Premature detonation",
    "Misfired blast fragments",
    "Flyrock from surface blast",
  ],
  "Slip/Fall": [
    "Fall from elevated work platform",
    "Slip on wet mine floor",
    "Trip on trailing cable",
  ],
  Other: [
    "Heat exhaustion in deep mine",
    "Inhalation of toxic gas",
    "Struck by falling object",
  ],
};

const CustomTooltip = ({
  active,
  payload,
  label,
  fatalOnly,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  fatalOnly?: boolean;
}) => {
  if (active && payload && payload.length) {
    const scenarios = ACCIDENT_SCENARIOS[label ?? ""] ?? [];
    return (
      <div
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "260px",
        }}
      >
        <p style={{ color: "#f5f5f5", fontWeight: 600, marginBottom: "6px" }}>
          {label}
        </p>
        <p
          style={{
            color: "#f97316",
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          {payload[0].value} {fatalOnly ? "fatal" : "accidents"}
        </p>
        {scenarios.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {scenarios.map((s, i) => (
              <li
                key={i}
                style={{
                  color: "#888",
                  fontSize: "12px",
                  marginBottom: "4px",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#f97316", flexShrink: 0 }}>—</span>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return null;
};

type FilterKey = "all" | "coal" | "metal" | "fatal";

export default function FatalityExplorer({
  records,
}: {
  records: AccidentRecord[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  const fatalOnly = activeFilter === "fatal";
  const mineType =
    activeFilter === "coal"
      ? "coal"
      : activeFilter === "metal"
      ? "metal_nonmetal"
      : "All";

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (mineType !== "All" && r.mine_type !== mineType) return false;
      if (fatalOnly && !r.fatal) return false;
      return true;
    });
  }, [records, mineType, fatalOnly]);

  const chartData = useMemo(() => {
    const totals: Record<string, number> = {};
    filtered.forEach((r) => {
      totals[r.accident_category] = (totals[r.accident_category] ?? 0) + 1;
    });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "coal", label: "Coal" },
    { key: "metal", label: "Metal / Non-Metal" },
    { key: "fatal", label: "Fatal Only" },
  ];

  return (
    <section
      id="data"
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
        {/* Label */}
        <p className="section-label section-fade" style={{ marginBottom: "24px" }}>
          02 — The Data
        </p>

        {/* Insight headline */}
        <p className="section-fade" style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 300, color: "#f5f5f5", lineHeight: 1.2, marginBottom: "24px", maxWidth: "680px" }}>
          <span style={{ color: "#f97316" }}>{chartData[0]?.name ?? "—"}</span>
          {" "}is the leading cause of mining accidents in this dataset.
        </p>

        {/* Pill filters */}
        <div
          className="section-fade"
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`pill-filter${activeFilter === f.key ? " active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="section-fade" style={{ marginBottom: "32px" }}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "#444", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#888", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={140}
                interval={0}
              />
              <Tooltip
                content={<CustomTooltip fatalOnly={fatalOnly} />}
                cursor={{ fill: "rgba(249,115,22,0.05)" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 3, 3, 0]}
                onClick={(data: { name?: string }) =>
                  setSelectedBar(
                    selectedBar === (data.name ?? null)
                      ? null
                      : data.name ?? null
                  )
                }
                cursor="pointer"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      selectedBar === null || selectedBar === entry.name
                        ? "#f97316"
                        : "#1e1e1e"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Count */}
        <p
          className="section-fade"
          style={{ color: "#444", fontSize: "12px", letterSpacing: "0.08em" }}
        >
          {filtered.length.toLocaleString()} incidents ·{" "}
          {fatalOnly ? "fatal only" : "all severity levels"}
        </p>
      </div>
    </section>
  );
}
