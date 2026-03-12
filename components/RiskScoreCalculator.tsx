"use client";

import { useState, useEffect, useRef } from "react";

export type RiskDrivers = {
  accidents: number;
  ssViolations: number;
  hasHaulage: boolean;
  isUnderground: boolean;
};

function useAnimatedNumber(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const animRef = useRef<number | null>(null);
  const prevRef = useRef(target);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    prevRef.current = target;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) animRef.current = requestAnimationFrame(animate);
      else setDisplay(to);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target, duration]);

  return display;
}

const RISK_LEVELS = [
  { max: 30, label: "Low Risk", color: "#22c55e", bg: "bg-green-900/30", border: "border-green-500/40" },
  { max: 60, label: "Moderate Risk", color: "#eab308", bg: "bg-yellow-900/30", border: "border-yellow-500/40" },
  { max: Infinity, label: "High Risk", color: "#ef4444", bg: "bg-red-900/30", border: "border-red-500/40" },
];

function getRiskLevel(score: number) {
  return RISK_LEVELS.find((l) => score <= l.max) ?? RISK_LEVELS[2];
}

export default function RiskScoreCalculator({
  onDriversChange,
}: {
  onDriversChange: (drivers: RiskDrivers) => void;
}) {
  const [accidents, setAccidents] = useState(5);
  const [ssViolations, setSsViolations] = useState(10);
  const [hasHaulage, setHasHaulage] = useState(false);
  const [isUnderground, setIsUnderground] = useState(false);

  const accidentContrib = accidents * 5;
  const ssContrib = ssViolations * 3;
  const haulageContrib = hasHaulage ? 8 : 0;
  const undergroundContrib = isUnderground ? 4 : 0;
  const totalScore = accidentContrib + ssContrib + haulageContrib + undergroundContrib;

  const animatedScore = useAnimatedNumber(totalScore);
  const riskLevel = getRiskLevel(totalScore);

  const drivers = [
    { label: "Recent Accidents", value: accidentContrib, raw: accidents },
    { label: "S&S Violations", value: ssContrib, raw: ssViolations },
    { label: "Powered Haulage", value: haulageContrib, raw: hasHaulage ? 1 : 0 },
    { label: "Underground Mine", value: undergroundContrib, raw: isUnderground ? 1 : 0 },
  ]
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  useEffect(() => {
    onDriversChange({ accidents, ssViolations, hasHaulage, isUnderground });
  }, [accidents, ssViolations, hasHaulage, isUnderground, onDriversChange]);

  const Slider = ({
    label,
    min,
    max,
    value,
    onChange,
    description,
  }: {
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (v: number) => void;
    description: string;
  }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-medium text-sm">{label}</label>
        <span className="text-orange-400 font-bold text-lg w-10 text-right">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500 h-1.5 rounded bg-slate-600 appearance-none cursor-pointer"
      />
      <p className="text-slate-500 text-xs mt-1">{description}</p>
    </div>
  );

  const Toggle = ({
    label,
    value,
    onChange,
    description,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
    description: string;
  }) => (
    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
      <div>
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-slate-500 text-xs mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? "bg-orange-500" : "bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            value ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <section id="risk" className="py-24 px-6 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        <p className="text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          03 / Risk Score
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Mine Risk Score Calculator
        </h2>
        <p className="text-slate-400 text-lg mb-4 max-w-2xl">
          Today, MSHA&apos;s Part 50 incident reports, S&amp;S violation records, and
          Pattern of Violations data live in separate silos. Cross-referencing
          them manually takes hours. This calculator shows what a unified risk
          signal could look like.
        </p>
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 mb-10 max-w-2xl">
          <p className="text-slate-400 text-sm">
            <strong className="text-white">Formula:</strong>{" "}
            <code className="text-orange-300 bg-slate-800 px-1 rounded">
              Score = (Accidents × 5) + (S&S Violations × 3) + (Haulage ? 8 : 0) + (Underground ? 4 : 0)
            </code>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-8">
            <Slider
              label="Recent Accidents (12 months)"
              min={0}
              max={20}
              value={accidents}
              onChange={setAccidents}
              description="Part 50 reportable incidents at this mine"
            />
            <Slider
              label="S&S Violations (12 months)"
              min={0}
              max={50}
              value={ssViolations}
              onChange={setSsViolations}
              description="Significant & Substantial violations from inspection records"
            />
            <Toggle
              label="Powered Haulage Equipment"
              value={hasHaulage}
              onChange={setHasHaulage}
              description="Haul trucks, conveyors, or other haulage systems on site"
            />
            <Toggle
              label="Underground Mine"
              value={isUnderground}
              onChange={setIsUnderground}
              description="Underground operations carry additional roof and gas hazards"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-6">
            {/* Score display */}
            <div
              className={`${riskLevel.bg} ${riskLevel.border} border rounded-xl p-8 flex flex-col items-center justify-center`}
            >
              <p className="text-slate-400 text-sm mb-4 uppercase tracking-wide">
                Risk Score
              </p>
              <div
                className="text-8xl font-bold mb-4 transition-colors duration-300"
                style={{ color: riskLevel.color }}
              >
                {animatedScore}
              </div>
              <div
                className="px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: riskLevel.color + "22",
                  color: riskLevel.color,
                  border: `1px solid ${riskLevel.color}44`,
                }}
              >
                {riskLevel.label}
              </div>
            </div>

            {/* Contribution breakdown */}
            {totalScore > 0 && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <p className="text-white font-semibold mb-4 text-sm">
                  Risk Factor Breakdown
                </p>
                <div className="space-y-3">
                  {drivers.map((d) => {
                    const pct = Math.round((d.value / totalScore) * 100);
                    return (
                      <div key={d.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{d.label}</span>
                          <span className="text-orange-400 font-medium">
                            +{d.value} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                    Top Risk Drivers
                  </p>
                  {drivers.slice(0, 2).map((d, i) => (
                    <div key={d.label} className="flex items-center gap-2 text-sm mb-1">
                      <span className="text-orange-400 font-bold">#{i + 1}</span>
                      <span className="text-white">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
