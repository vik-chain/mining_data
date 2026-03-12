"use client";

import type { RiskDrivers } from "./RiskScoreCalculator";

type Recommendation = {
  title: string;
  severity: "Critical" | "High" | "Moderate";
  recommendations: string[];
  icon: string;
};

const DRIVER_MAP: Record<string, Recommendation> = {
  "Recent Accidents": {
    title: "High Accident Frequency",
    severity: "Critical",
    icon: "🔴",
    recommendations: [
      "Mandatory root cause analysis for every reportable incident within 72 hours",
      "Near-miss reporting system with anonymous submission to reduce underreporting",
      "Cross-mine incident sharing program — pattern analysis across similar operations",
    ],
  },
  "S&S Violations": {
    title: "Significant & Substantial Violations",
    severity: "Critical",
    icon: "⚠️",
    recommendations: [
      "Targeted compliance coaching: pair the mine with a dedicated MSHA compliance officer",
      "Systematic violation pattern review — identify repeat hazard categories vs. one-off errors",
      "Operator self-audit program with quarterly submissions before scheduled MSHA inspections",
    ],
  },
  "Powered Haulage": {
    title: "Powered Haulage Hazards",
    severity: "High",
    icon: "🚛",
    recommendations: [
      "Mandatory collision detection and proximity warning systems on all haul trucks",
      "Operator certification refresher training every 12 months with simulator exercises",
      "Traffic management plan with designated pedestrian corridors and exclusion zones",
    ],
  },
  "Underground Mine": {
    title: "Underground Operation Hazards",
    severity: "High",
    icon: "⛏️",
    recommendations: [
      "Roof support audits every 30 days in active sections — photographic records required",
      "Continuous methane and CO monitoring with automatic fan shutdown triggers",
      "Emergency egress drills twice per year for all underground personnel",
    ],
  },
};

const ALL_DRIVERS = [
  "Recent Accidents",
  "S&S Violations",
  "Powered Haulage",
  "Underground Mine",
];

function getTopDrivers(drivers: RiskDrivers): string[] {
  const scores: { label: string; score: number }[] = [
    { label: "Recent Accidents", score: drivers.accidents * 5 },
    { label: "S&S Violations", score: drivers.ssViolations * 3 },
    { label: "Powered Haulage", score: drivers.hasHaulage ? 8 : 0 },
    { label: "Underground Mine", score: drivers.isUnderground ? 4 : 0 },
  ];
  return scores
    .sort((a, b) => b.score - a.score)
    .filter((d) => d.score > 0)
    .slice(0, 2)
    .map((d) => d.label);
}

const SEVERITY_STYLE: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  Critical: {
    text: "text-red-400",
    bg: "bg-red-900/20",
    border: "border-red-500/30",
  },
  High: {
    text: "text-orange-400",
    bg: "bg-orange-900/20",
    border: "border-orange-500/30",
  },
  Moderate: {
    text: "text-yellow-400",
    bg: "bg-yellow-900/20",
    border: "border-yellow-500/30",
  },
};

export default function PreventionPanel({
  riskDrivers,
}: {
  riskDrivers: RiskDrivers;
}) {
  const totalScore =
    riskDrivers.accidents * 5 +
    riskDrivers.ssViolations * 3 +
    (riskDrivers.hasHaulage ? 8 : 0) +
    (riskDrivers.isUnderground ? 4 : 0);

  const topDrivers =
    totalScore > 0 ? getTopDrivers(riskDrivers) : ALL_DRIVERS.slice(0, 2);

  const recommendations = topDrivers.map((d) => DRIVER_MAP[d]).filter(Boolean);

  return (
    <section id="prevention" className="py-24 px-6 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        <p className="text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          05 / Prevention
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Prevention Recommendations
        </h2>
        <p className="text-slate-400 text-lg mb-2 max-w-2xl">
          Intervention effectiveness is highest before the incident, not after.
          Recommendations below are dynamically matched to your risk profile.
        </p>
        {totalScore > 0 && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 mb-10 inline-flex items-center gap-3 text-sm">
            <span className="text-slate-400">Based on your risk profile:</span>
            <span className="text-orange-400 font-semibold">
              Score {totalScore} — Top drivers highlighted
            </span>
          </div>
        )}
        {totalScore === 0 && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 mb-10 inline-flex items-center gap-3 text-sm">
            <span className="text-slate-400">
              Showing default recommendations — adjust the Risk Score Calculator above to personalize
            </span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((rec, i) => {
            const style = SEVERITY_STYLE[rec.severity];
            return (
              <div
                key={rec.title}
                className={`${style.bg} ${style.border} border rounded-xl p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                      <p className="text-slate-400 text-xs mb-0.5">
                        Priority #{i + 1}
                      </p>
                      <h3 className="text-white font-bold text-lg">
                        {rec.title}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`${style.text} text-xs font-semibold px-3 py-1 rounded-full border ${style.border}`}
                  >
                    {rec.severity}
                  </span>
                </div>
                <ul className="space-y-3">
                  {rec.recommendations.map((r, j) => (
                    <li key={j} className="flex gap-3 text-sm">
                      <span className="text-orange-400 mt-0.5 shrink-0">→</span>
                      <span className="text-slate-300">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
