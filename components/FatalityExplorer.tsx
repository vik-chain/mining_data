"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AccidentRecord } from "@/lib/csvLoader";

const ACCIDENT_SCENARIOS: Record<string, string[]> = {
  "Powered Haulage":
    ["Haul truck backing over worker", "Runaway vehicle on grade", "Pinch point between haulage units"],
  "Fall of Ground":
    ["Unsupported roof collapse", "Rib failure in mine opening", "Highwall failure at surface cut"],
  Machinery:
    ["Worker caught in conveyor belt", "Rotating equipment entanglement", "Hydraulic line failure"],
  Electrical:
    ["Arc flash from energized equipment", "Electrocution via faulty wiring", "Contact with overhead lines"],
  Explosive:
    ["Premature detonation", "Misfired blast fragments", "Flyrock from surface blast"],
  "Slip/Fall":
    ["Fall from elevated work platform", "Slip on wet mine floor", "Trip on trailing cable"],
  Other: ["Heat exhaustion in deep mine", "Inhalation of toxic gas", "Struck by falling object"],
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
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 max-w-xs shadow-xl">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-orange-400 text-2xl font-bold mb-2">
          {payload[0].value} {fatalOnly ? "fatal incidents" : "accidents"}
        </p>
        {scenarios.length > 0 && (
          <>
            <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
              Common scenarios
            </p>
            <ul className="space-y-1">
              {scenarios.map((s, i) => (
                <li key={i} className="text-slate-300 text-xs flex gap-2">
                  <span className="text-orange-400 mt-0.5">›</span>
                  {s}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }
  return null;
};

const MINE_TYPE_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Coal", value: "coal" },
  { label: "Metal/Nonmetal", value: "metal_nonmetal" },
];

export default function FatalityExplorer({
  records,
}: {
  records: AccidentRecord[];
}) {
  const [mineType, setMineType] = useState("All");
  const [state, setState] = useState("All");
  const [fatalOnly, setFatalOnly] = useState(false);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  const states = useMemo(
    () => ["All", ...Array.from(new Set(records.map((r) => r.state))).sort()],
    [records]
  );

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (mineType !== "All" && r.mine_type !== mineType) return false;
      if (state !== "All" && r.state !== state) return false;
      if (fatalOnly && !r.fatal) return false;
      return true;
    });
  }, [records, mineType, state, fatalOnly]);

  const chartData = useMemo(() => {
    const totals: Record<string, number> = {};
    filtered.forEach((r) => {
      totals[r.accident_category] = (totals[r.accident_category] ?? 0) + 1;
    });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const totalAccidents = records.length;
  const filteredCount = filtered.length;
  const fatalInFiltered = filtered.filter((r) => r.fatal).length;

  const topTwo = chartData.slice(0, 2);
  const topTwoTotal = topTwo.reduce((s, d) => s + d.value, 0);
  const topTwoPct =
    filteredCount > 0 ? Math.round((topTwoTotal / filteredCount) * 100) : 0;

  const ToggleBtn = ({
    label,
    value,
    active,
    onClick,
  }: {
    label: string;
    value: string;
    active: boolean;
    onClick: (v: string) => void;
  }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-orange-500 text-white"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="explorer" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          02 / Patterns
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Accident Pattern Explorer
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl">
          Not all accidents are equal. A small set of accident categories drive
          the majority of incidents — and they cluster around specific mine types
          and states.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          {/* Fatal / All toggle */}
          <div className="flex gap-2">
            <ToggleBtn
              label="All Accidents"
              value="all"
              active={!fatalOnly}
              onClick={() => setFatalOnly(false)}
            />
            <ToggleBtn
              label="Fatal Only"
              value="fatal"
              active={fatalOnly}
              onClick={() => setFatalOnly(true)}
            />
          </div>

          {/* Mine type */}
          <div className="flex gap-2">
            {MINE_TYPE_OPTIONS.map(({ label, value }) => (
              <ToggleBtn
                key={value}
                label={label}
                value={value}
                active={mineType === value}
                onClick={setMineType}
              />
            ))}
          </div>

          {/* State dropdown */}
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="bg-slate-700 text-slate-300 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All States" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Counters */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="text-slate-400 text-sm">
            <span className="text-white font-semibold text-lg">
              {totalAccidents.toLocaleString()}
            </span>{" "}
            total accidents analyzed
          </div>
          <div className="text-slate-600">·</div>
          <div className="text-slate-400 text-sm">
            <span className="text-orange-400 font-semibold text-lg">
              {filteredCount.toLocaleString()}
            </span>{" "}
            matching filters
          </div>
          {fatalOnly && (
            <>
              <div className="text-slate-600">·</div>
              <div className="text-slate-400 text-sm">
                <span className="text-red-400 font-semibold text-lg">
                  {fatalInFiltered.toLocaleString()}
                </span>{" "}
                fatalities in filtered set
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#374151"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#d1d5db", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip
                content={<CustomTooltip fatalOnly={fatalOnly} />}
                cursor={{ fill: "rgba(249,115,22,0.08)" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                onClick={(data: { name?: string }) =>
                  setSelectedBar(
                    selectedBar === (data.name ?? null) ? null : (data.name ?? null)
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
                        : "#374151"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight callout */}
        {topTwo.length >= 2 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 flex gap-4 items-start">
            <div className="text-orange-400 text-2xl">⚠</div>
            <div>
              <p className="text-white font-semibold mb-1">Key Insight</p>
              <p className="text-slate-300 text-sm">
                <strong className="text-orange-400">
                  {topTwo[0]?.name} and {topTwo[1]?.name}
                </strong>{" "}
                account for{" "}
                <strong className="text-orange-400">{topTwoPct}%</strong> of
                all {fatalOnly ? "fatal incidents" : "accidents"} in the
                selected filter. These two categories alone represent the
                highest-leverage intervention points for MSHA inspectors.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
