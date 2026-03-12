"use client";

import { useState, useEffect, useRef } from "react";
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

type Strategy = "random" | "risk";

const BASELINE = 18;
const RISK_REDUCTION = 0.4;

function AnimatedCount({
  from,
  to,
  active,
}: {
  from: number;
  to: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState(from);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const target = active ? to : from;
    const start = performance.now();
    const startVal = display;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    const animate = (now: number) => {
      const p = Math.min((now - start) / 800, 1);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplay(Math.round(startVal + (target - startVal) * eased));
      if (p < 1) animRef.current = requestAnimationFrame(animate);
      else setDisplay(target);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, from, to]);

  return <>{display}</>;
}

export default function InspectionSimulator() {
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  const riskFatalities = Math.round(BASELINE * (1 - RISK_REDUCTION));
  const isRisk = strategy === "risk";
  const isRandom = strategy === "random";

  const comparisonData = [
    {
      name: "High-Risk\nMines Found",
      Random: 20,
      "Risk-Based": 80,
    },
    {
      name: "Expected\nFatality\nReduction",
      Random: 0,
      "Risk-Based": 40,
    },
  ];

  return (
    <section id="simulator" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          04 / Inspections
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Inspection Strategy Simulator
        </h2>
        <p className="text-slate-400 text-lg mb-2 max-w-2xl">
          MSHA inspectors face a resource constraint: you can only inspect a
          fraction of mines each quarter. Strategy choice changes outcomes
          dramatically.
        </p>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-5 py-4 mb-12 max-w-2xl">
          <p className="text-white font-medium">
            Scenario: You can inspect{" "}
            <span className="text-orange-400 font-bold">20%</span> of mines this
            quarter. Which strategy do you choose?
          </p>
        </div>

        {/* Strategy cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl">
          <button
            onClick={() => setStrategy("random")}
            className={`text-left p-6 rounded-xl border-2 transition-all ${
              strategy === "random"
                ? "border-slate-400 bg-slate-700"
                : "border-slate-700 bg-slate-800 hover:border-slate-500"
            }`}
          >
            <div className="text-3xl mb-3">🎲</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Random Inspection
            </h3>
            <p className="text-slate-400 text-sm">
              Select mines randomly from the full roster. No prioritization
              — fair by chance, not by risk.
            </p>
            {isRandom && (
              <div className="mt-4 flex items-center gap-2 text-slate-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                Current approach in many districts
              </div>
            )}
          </button>

          <button
            onClick={() => setStrategy("risk")}
            className={`text-left p-6 rounded-xl border-2 transition-all ${
              strategy === "risk"
                ? "border-orange-500 bg-orange-500/10"
                : "border-slate-700 bg-slate-800 hover:border-orange-500/50"
            }`}
          >
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Risk-Based Inspection
            </h3>
            <p className="text-slate-400 text-sm">
              Prioritize mines with the highest composite risk scores — using
              accident history, S&S violations, and equipment data.
            </p>
            {isRisk && (
              <div className="mt-4 flex items-center gap-2 text-orange-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                Recommended approach
              </div>
            )}
          </button>
        </div>

        {/* Results — animate in */}
        {strategy && (
          <div className="animate-[fadeIn_0.5s_ease]">
            {/* Stat cards */}
            <div className="grid md:grid-cols-3 gap-5 mb-10">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-1">Mines Inspected</p>
                <p className="text-white text-4xl font-bold">20%</p>
                <p className="text-slate-500 text-xs mt-1">Same for both strategies</p>
              </div>
              <div
                className={`rounded-xl p-6 border ${
                  isRisk
                    ? "bg-green-900/20 border-green-500/30"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <p className="text-slate-400 text-sm mb-1">High-Risk Mines Caught</p>
                <p
                  className={`text-4xl font-bold ${
                    isRisk ? "text-green-400" : "text-slate-300"
                  }`}
                >
                  {isRisk ? "~80%" : "~20%"}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {isRisk ? "4× better than random" : "Chance-based result"}
                </p>
              </div>
              <div
                className={`rounded-xl p-6 border ${
                  isRisk
                    ? "bg-green-900/20 border-green-500/30"
                    : "bg-red-900/20 border-red-500/30"
                }`}
              >
                <p className="text-slate-400 text-sm mb-1">Expected Fatalities</p>
                <p
                  className={`text-4xl font-bold ${
                    isRisk ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <AnimatedCount
                    from={BASELINE}
                    to={riskFatalities}
                    active={isRisk}
                  />
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {isRisk
                    ? `↓ ${Math.round(RISK_REDUCTION * 100)}% vs baseline of ${BASELINE}`
                    : "No reduction from baseline"}
                </p>
              </div>
            </div>

            {/* Comparison chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <h3 className="text-white font-semibold mb-6">
                Strategy Comparison (%)
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={comparisonData}
                  margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#f9fafb",
                    }}
                    formatter={(value) => [`${value}%`]}
                  />
                  <Bar dataKey="Random" name="Random" radius={[4, 4, 0, 0]}>
                    {comparisonData.map((_, i) => (
                      <Cell key={i} fill="#6b7280" />
                    ))}
                  </Bar>
                  <Bar dataKey="Risk-Based" name="Risk-Based" radius={[4, 4, 0, 0]}>
                    {comparisonData.map((_, i) => (
                      <Cell key={i} fill="#f97316" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-4 justify-end">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-3 h-3 rounded bg-slate-500 inline-block" />
                  Random
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-3 h-3 rounded bg-orange-500 inline-block" />
                  Risk-Based
                </div>
              </div>
            </div>
          </div>
        )}

        {!strategy && (
          <div className="text-center py-16 text-slate-600">
            <div className="text-5xl mb-4">☝</div>
            <p className="text-lg">Select a strategy above to see the impact</p>
          </div>
        )}
      </div>
    </section>
  );
}
