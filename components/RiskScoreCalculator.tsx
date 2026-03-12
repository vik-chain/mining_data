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
    prevRef.current = target;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplay(Math.round(from + (target - from) * eased));
      if (p < 1) animRef.current = requestAnimationFrame(animate);
      else setDisplay(target);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target, duration]);

  return display;
}

const RISK_LEVELS = [
  { max: 30, label: "Low Risk", color: "#22c55e" },
  { max: 60, label: "Moderate Risk", color: "#eab308" },
  { max: Infinity, label: "High Risk", color: "#ef4444" },
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
  const totalScore =
    accidentContrib + ssContrib + haulageContrib + undergroundContrib;

  const animatedScore = useAnimatedNumber(totalScore);
  const riskLevel = getRiskLevel(totalScore);

  const drivers = [
    { label: "Recent accidents", value: accidentContrib },
    { label: "S&S violations", value: ssContrib },
    { label: "Powered haulage equipment", value: haulageContrib },
    { label: "Underground operation", value: undergroundContrib },
  ]
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  useEffect(() => {
    onDriversChange({ accidents, ssViolations, hasHaulage, isUnderground });
  }, [accidents, ssViolations, hasHaulage, isUnderground, onDriversChange]);

  return (
    <section
      id="risk"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "15vh",
        paddingBottom: "10vh",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div className="content-wrap">
        {/* Label */}
        <p className="section-label section-fade" style={{ marginBottom: "24px" }}>
          03 — Risk Profile
        </p>

        <p
          className="section-fade"
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 300,
            color: "#f5f5f5",
            lineHeight: 1.2,
            marginBottom: "64px",
            maxWidth: "600px",
          }}
        >
          Every mine has a calculable risk profile.
        </p>

        {/* Two-column layout */}
        <div
          className="section-fade"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "start",
          }}
        >
          {/* Left: inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Slider: Accidents */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <label
                  style={{ color: "#888", fontSize: "13px", letterSpacing: "0.04em" }}
                >
                  Recent Accidents
                </label>
                <span
                  style={{ color: "#f97316", fontWeight: 700, fontSize: "16px" }}
                >
                  {accidents}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={accidents}
                onChange={(e) => setAccidents(Number(e.target.value))}
              />
            </div>

            {/* Slider: S&S Violations */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <label
                  style={{ color: "#888", fontSize: "13px", letterSpacing: "0.04em" }}
                >
                  S&amp;S Violations
                </label>
                <span
                  style={{ color: "#f97316", fontWeight: 700, fontSize: "16px" }}
                >
                  {ssViolations}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={ssViolations}
                onChange={(e) => setSsViolations(Number(e.target.value))}
              />
            </div>

            {/* Toggle: Haulage */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#888", fontSize: "13px" }}>
                Powered Haulage Equipment
              </span>
              <button
                onClick={() => setHasHaulage(!hasHaulage)}
                style={{
                  position: "relative",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: hasHaulage ? "#f97316" : "#222",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    left: hasHaulage ? "24px" : "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>

            {/* Toggle: Underground */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#888", fontSize: "13px" }}>
                Underground Mine
              </span>
              <button
                onClick={() => setIsUnderground(!isUnderground)}
                style={{
                  position: "relative",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: isUnderground ? "#f97316" : "#222",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    left: isUnderground ? "24px" : "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Right: score output */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Big score number */}
            <div>
              <div
                style={{
                  fontSize: "clamp(80px, 10vw, 120px)",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: riskLevel.color,
                  transition: "color 0.4s ease",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {animatedScore}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: riskLevel.color,
                  marginTop: "12px",
                  transition: "color 0.4s ease",
                }}
              >
                {riskLevel.label}
              </p>
            </div>

            {/* Top driver bullets */}
            {drivers.length > 0 && (
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "24px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#444",
                    marginBottom: "16px",
                  }}
                >
                  Top Drivers
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {drivers.slice(0, 3).map((d) => (
                    <div
                      key={d.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: "#888",
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ color: "#f97316", fontWeight: 700 }}>—</span>
                      {d.label}
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
