"use client";

import type { RiskDrivers } from "./RiskScoreCalculator";

type CardData = {
  title: string;
  description: string;
  activeWhen: (d: RiskDrivers) => boolean;
  midState?: boolean;
  icon: (stroke: string) => React.ReactNode;
};

const CARDS: CardData[] = [
  {
    title: "Incident Frequency",
    description:
      "Increase inspection cadence to quarterly. Mandate root cause analysis within 72 hours of each reportable incident.",
    activeWhen: (d) => d.accidents > 0,
    icon: (stroke) => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M18 5L32 29H4L18 5Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <text
          x="18"
          y="24"
          textAnchor="middle"
          fill={stroke}
          fontSize="11"
          fontWeight="700"
        >
          !
        </text>
      </svg>
    ),
  },
  {
    title: "S&S Compliance",
    description:
      "Resolve S&S violations within 30 days or escalate to pattern-of-violations review. Pair with a dedicated compliance officer.",
    activeWhen: (d) => d.ssViolations > 0,
    icon: (stroke) => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M18 3L30 8V18C30 25 18 33 18 33C18 33 6 25 6 18V8L18 3Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="13" y1="18" x2="23" y2="18" stroke={stroke} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Cross-Mine Patterns",
    description:
      "Share near-miss reports across similar operations to surface common hazards before they become fatalities.",
    activeWhen: () => false,
    midState: true,
    icon: (stroke) => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M2 30V18C2 11 6 7 10 7C14 7 16 11 16 18V30"
          stroke={stroke}
          strokeWidth="1.5"
        />
        <path
          d="M20 30V18C20 11 22 7 26 7C30 7 34 11 34 18V30"
          stroke={stroke}
          strokeWidth="1.5"
        />
        <line
          x1="16"
          y1="18"
          x2="20"
          y2="18"
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  {
    title: "Proactive Audits",
    description:
      "Operator self-audit submissions before scheduled MSHA inspections — replacing reactive enforcement with proactive compliance.",
    activeWhen: () => false,
    midState: true,
    icon: (stroke) => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="8" width="24" height="22" rx="2" stroke={stroke} strokeWidth="1.5" />
        <line x1="4" y1="15" x2="28" y2="15" stroke={stroke} strokeWidth="1.5" />
        <line x1="11" y1="4" x2="11" y2="12" stroke={stroke} strokeWidth="1.5" />
        <line x1="21" y1="4" x2="21" y2="12" stroke={stroke} strokeWidth="1.5" />
        <circle cx="29" cy="27" r="5" fill={stroke} />
        <text
          x="29"
          y="31"
          textAnchor="middle"
          fill="#0a0a0a"
          fontSize="7"
          fontWeight="700"
        >
          !
        </text>
      </svg>
    ),
  },
];

export default function PreventionPanel({
  riskDrivers,
}: {
  riskDrivers: RiskDrivers;
}) {
  return (
    <section
      id="prevention"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "8vh",
        paddingBottom: "4vh",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div className="content-wrap">
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
            marginBottom: "32px",
            maxWidth: "600px",
          }}
        >
          High-risk scores map to specific interventions.
        </p>

        <div
          className="section-fade"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {CARDS.map((card) => {
            const isActive = card.activeWhen(riskDrivers);
            const isMid = card.midState;

            const borderStyle = isActive
              ? "1px solid rgba(249,115,22,0.3)"
              : isMid
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.06)";
            const bgStyle = isActive ? "rgba(249,115,22,0.04)" : "transparent";
            const iconStroke = isActive ? "#f97316" : isMid ? "#555" : "#444";
            const titleColor = isActive ? "#f97316" : isMid ? "#555" : "#444";

            return (
              <div
                key={card.title}
                style={{
                  padding: "24px",
                  borderRadius: "8px",
                  border: borderStyle,
                  background: bgStyle,
                  transition: "border-color 0.3s, background 0.3s",
                }}
              >
                <div style={{ marginBottom: "16px" }}>{card.icon(iconStroke)}</div>
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: titleColor,
                    marginBottom: "10px",
                    fontWeight: 500,
                    transition: "color 0.3s",
                  }}
                >
                  {card.title}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
