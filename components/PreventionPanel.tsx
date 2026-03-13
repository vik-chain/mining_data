"use client";

type CardData = {
  title: string;
  label: string;
  description: string;
  icon: () => React.ReactNode;
};

const CARDS: CardData[] = [
  {
    title: "Automated Incident Reporting",
    label: "Replace Form 7000-1",
    description:
      "Paper and fax submission means 2–3 days before MSHA knows an incident occurred. A structured digital intake integrated with operator systems enables real-time pattern detection the day it happens.",
    icon: () => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="22" height="28" rx="2" stroke="#f97316" strokeWidth="1.5" />
        <line x1="8" y1="11" x2="22" y2="11" stroke="#f97316" strokeWidth="1.2" />
        <line x1="8" y1="16" x2="22" y2="16" stroke="#f97316" strokeWidth="1.2" />
        <line x1="8" y1="21" x2="16" y2="21" stroke="#f97316" strokeWidth="1.2" />
        <circle cx="28" cy="28" r="7" fill="#0a0a0a" stroke="#f97316" strokeWidth="1.2" />
        <line x1="28" y1="24" x2="28" y2="28" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="28" y1="28" x2="31" y2="31" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Hazard Alerts & Smart Inspections",
    label: "S&S Compliance + Event-Driven Response",
    description:
      "When a mine's risk score spikes — new S&S violations, a near-miss, a complaint surge — inspectors receive an automated push alert. Replace annual calendar cadence with event-driven dispatch.",
    icon: () => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M18 5C18 5 8 9 8 18V25H28V18C28 9 18 5 18 5Z"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="14" y1="25" x2="22" y2="25" stroke="#f97316" strokeWidth="1.5" />
        <line x1="16" y1="28" x2="20" y2="28" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="28" cy="9" r="5" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="1.2" />
        <text x="28" y="13" textAnchor="middle" fill="#f97316" fontSize="8" fontWeight="700">!</text>
      </svg>
    ),
  },
  {
    title: "Cross-Mine Pattern Detection",
    label: "Network-Wide Safety Intelligence",
    description:
      "Share anonymized near-miss reports across similar operations to surface common hazards before they become fatalities. Cross-mine pattern tracking gives operators and MSHA early warning before enforcement actions.",
    icon: () => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M2 30V18C2 11 6 7 10 7C14 7 16 11 16 18V30"
          stroke="#f97316"
          strokeWidth="1.5"
        />
        <path
          d="M20 30V18C20 11 22 7 26 7C30 7 34 11 34 18V30"
          stroke="#f97316"
          strokeWidth="1.5"
        />
        <line
          x1="16"
          y1="18"
          x2="20"
          y2="18"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  {
    title: "Equipment Telemetry",
    label: "Predictive Alerting via Sensor Data",
    description:
      "Modern haul trucks, conveyors, and panels ship with GPS, collision sensors, and load monitors. Integrating telemetry with the risk platform flags anomalies before they become fatalities — the same vision demonstrated in the final section.",
    icon: () => (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="8" y="12" width="20" height="14" rx="2" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="14" cy="19" r="2" stroke="#f97316" strokeWidth="1.2" />
        <circle cx="22" cy="19" r="2" stroke="#f97316" strokeWidth="1.2" />
        <line x1="18" y1="8" x2="18" y2="12" stroke="#f97316" strokeWidth="1.2" />
        <line x1="14" y1="26" x2="14" y2="30" stroke="#f97316" strokeWidth="1.2" />
        <line x1="22" y1="26" x2="22" y2="30" stroke="#f97316" strokeWidth="1.2" />
      </svg>
    ),
  },
];

export default function PreventionPanel() {
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
          05 — Solutions
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
          Four improvements MSHA could make today.
        </p>

        <div
          className="section-fade"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.title}
              style={{
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid rgba(249,115,22,0.3)",
                background: "rgba(249,115,22,0.04)",
              }}
            >
              <div style={{ marginBottom: "16px" }}>{card.icon()}</div>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#f97316",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                {card.label}
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
          ))}
        </div>
      </div>
    </section>
  );
}
