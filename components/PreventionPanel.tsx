"use client";

import type { RiskDrivers } from "./RiskScoreCalculator";

type BulletItem = {
  driver: string;
  text: string;
};

const ALL_BULLETS: BulletItem[] = [
  {
    driver: "accidents",
    text: "Address high accident frequency: increase inspection cadence to quarterly and mandate root cause analysis within 72 hours of each reportable incident.",
  },
  {
    driver: "ssViolations",
    text: "Resolve S&S violations within 30 days or escalate to pattern-of-violations review — pair the mine with a dedicated compliance officer.",
  },
  {
    driver: "haulage",
    text: "Powered haulage: mandatory pre-shift equipment checks logged digitally, with collision detection systems on all haul trucks.",
  },
  {
    driver: "underground",
    text: "Underground operations: roof support audits every 30 days in active sections, continuous methane monitoring with automatic fan shutdown triggers.",
  },
  {
    driver: "general",
    text: "Systematic violation pattern review across similar operations — share near-miss reports mine-to-mine to surface common hazards before they become fatalities.",
  },
  {
    driver: "general",
    text: "Operator self-audit program with quarterly submissions before scheduled MSHA inspections, replacing reactive enforcement with proactive compliance.",
  },
];

function getRelevantBullets(drivers: RiskDrivers): BulletItem[] {
  const relevant: BulletItem[] = [];

  if (drivers.accidents > 0) {
    const b = ALL_BULLETS.find((b) => b.driver === "accidents");
    if (b) relevant.push(b);
  }
  if (drivers.ssViolations > 0) {
    const b = ALL_BULLETS.find((b) => b.driver === "ssViolations");
    if (b) relevant.push(b);
  }
  if (drivers.hasHaulage) {
    const b = ALL_BULLETS.find((b) => b.driver === "haulage");
    if (b) relevant.push(b);
  }
  if (drivers.isUnderground) {
    const b = ALL_BULLETS.find((b) => b.driver === "underground");
    if (b) relevant.push(b);
  }

  // Always include general bullets to fill out the list
  ALL_BULLETS.filter((b) => b.driver === "general").forEach((b) =>
    relevant.push(b)
  );

  // Deduplicate and limit
  const seen = new Set<string>();
  return relevant.filter((b) => {
    if (seen.has(b.text)) return false;
    seen.add(b.text);
    return true;
  });
}

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

  const bullets =
    totalScore > 0
      ? getRelevantBullets(riskDrivers)
      : ALL_BULLETS;

  return (
    <section
      id="prevention"
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
          06 — Prevention
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
          High-risk scores map to specific interventions.
        </p>

        {/* Bullet list */}
        <div
          className="section-fade"
          style={{ display: "flex", flexDirection: "column", gap: "0" }}
        >
          {bullets.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "24px",
                paddingTop: "28px",
                paddingBottom: "28px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  color: "#f97316",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: 1.6,
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                —
              </span>
              <p
                style={{
                  color: "#888",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </section>
  );
}
