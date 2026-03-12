"use client";

const IDEAS = [
  {
    number: "01",
    title: "Automated Incident Reporting",
    subtitle: "Replace Form 7000-1",
    impact: "2–3 day reporting lag → real-time",
    description:
      "Form 7000-1 is still submitted as paper or fax. A structured digital intake integrated with mine operator systems would enable real-time pattern detection the day an incident occurs.",
  },
  {
    number: "02",
    title: "Equipment Telemetry Integration",
    subtitle: "Real-Time Sensor Data",
    impact: "Reactive inspection → predictive alerting",
    description:
      "Modern haul trucks ship with GPS, collision sensors, and load monitors. Integrating this telemetry with MSHA's risk platform flags anomalies before they become fatalities.",
  },
  {
    number: "03",
    title: "Real-Time Hazard Alerts",
    subtitle: "Inspector Push Notifications",
    impact: "Annual inspection cadence → event-driven response",
    description:
      "When a mine's risk score spikes — new S&S violations, a near-miss, or a sudden complaint surge — inspectors receive an automated alert. The same way a bank flags unusual transactions.",
  },
];

export default function FutureSection() {
  return (
    <section
      id="future"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "15vh",
        paddingBottom: "10vh",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="content-wrap">
        {/* Label */}
        <p className="section-label section-fade" style={{ marginBottom: "24px" }}>
          07 — Future
        </p>

        <p
          className="section-fade"
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 300,
            color: "#f5f5f5",
            lineHeight: 1.2,
            marginBottom: "80px",
            maxWidth: "600px",
          }}
        >
          What the full system could look like.
        </p>

        {/* Three clean rows */}
        <div
          className="section-fade"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {IDEAS.map((idea, i) => (
            <div
              key={idea.number}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr",
                gap: "32px",
                alignItems: "start",
                paddingTop: i === 0 ? 0 : "48px",
                paddingBottom: "48px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Number */}
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  color: "#333",
                  fontWeight: 500,
                  paddingTop: "4px",
                }}
              >
                {idea.number}
              </span>

              {/* Title + subtitle */}
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#f97316",
                    marginBottom: "8px",
                  }}
                >
                  {idea.subtitle}
                </p>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "#f5f5f5",
                    lineHeight: 1.3,
                    marginBottom: "8px",
                  }}
                >
                  {idea.title}
                </h3>
                <p style={{ fontSize: "12px", color: "#f97316", fontStyle: "italic" }}>
                  {idea.impact}
                </p>
              </div>

              {/* Description */}
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  paddingTop: "4px",
                }}
              >
                {idea.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div
          className="section-fade"
          style={{ marginTop: "100px", maxWidth: "560px" }}
        >
          <p
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 300,
              color: "#f5f5f5",
              lineHeight: 1.3,
              marginBottom: "16px",
            }}
          >
            The data to save lives already exists.
          </p>
          <p style={{ color: "#555", fontSize: "16px" }}>
            The question is whether we act on it.
          </p>
        </div>

        {/* Footer */}
        <p
          className="section-fade"
          style={{
            marginTop: "80px",
            paddingTop: "40px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#333",
            fontSize: "12px",
            letterSpacing: "0.04em",
          }}
        >
          Built with synthetic MSHA data for analytical demonstration. Data
          structure is compatible with real MSHA Part 50 exports.
        </p>
      </div>
    </section>
  );
}
